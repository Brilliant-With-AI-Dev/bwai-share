#!/usr/bin/env python3
"""Explicit GoTu copy-review round trips. Python 3.10+, standard library only."""
import argparse
import csv
import difflib
import hashlib
import html
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

FORMAT = 'gotu-copy-review/1'
FIELDS = ['Block ID', 'Order', 'Page', 'Section', 'Provenance',
          'Current copy (Markdown)', 'Draft copy (Markdown)', 'Comments',
          'Resolution', 'Decision']
IMMUTABLE = FIELDS[:6]

class ReviewError(Exception):
    pass

def require(ok, message):
    if not ok:
        raise ReviewError(message)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def encode(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()

def read_json(path):
    return json.loads(Path(path).read_text())

def relative(name):
    p = PurePosixPath(name)
    require(name and not p.is_absolute() and '..' not in p.parts and '\\' not in name,
            f'Unsafe relative path: {name!r}')
    return p

def files(root):
    require(root.is_dir() and not root.is_symlink(), f'Not a source directory: {root}')
    result = {}
    for p in sorted(root.rglob('*')):
        require(not p.is_symlink(), f'Symlink not allowed in source: {p}')
        if p.is_file():
            result[p.relative_to(root).as_posix()] = digest(p.read_bytes())
    require(result, 'Source directory is empty')
    return result

def check_tree(root, expected):
    actual = files(root)
    changed = sorted(k for k in set(actual) | set(expected) if actual.get(k) != expected.get(k))
    require(not changed, 'Source baseline changed: ' + ', '.join(changed))

def write_csv(path, rows):
    with Path(path).open('w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)

def csv_rows(path):
    with Path(path).open(newline='', encoding='utf-8-sig') as f:
        r = csv.DictReader(f)
        require(r.fieldnames == FIELDS, 'CSV headers changed; preserve the exported headers and order')
        values = list(r)
    require(all(None not in r and all(v is not None for v in r.values()) for r in values),
            'Malformed CSV row; use a CSV writer or Google Sheets CSV export')
    return values

def row_for(block, base):
    return {'Block ID': block['id'], 'Order': str(block['order']), 'Page': block['page'],
            'Section': block['section'], 'Provenance': block['provenance'],
            'Current copy (Markdown)': block['copy'], 'Draft copy (Markdown)': '',
            'Comments': '', 'Resolution': '', 'Decision': ''}

def export_review(repo, catalog_path, out):
    repo, out = Path(repo).resolve(), Path(out).resolve()
    require(not out.exists(), f'Output already exists: {out}')
    require(not out.is_relative_to(repo), 'Review packages must stay outside the public publishing repository')
    catalog = read_json(catalog_path)
    require(catalog.get('format') == FORMAT, 'Unsupported catalog format')
    candidate = relative(catalog['source']['candidate'])
    source = repo / str(candidate)
    require(source.resolve().is_relative_to(repo), 'Source escapes repository')
    check_tree(source, catalog['source']['files'])
    ids = [b['id'] for b in catalog['blocks']]
    require(len(set(ids)) == len(ids), 'Duplicate catalog block IDs')
    out.mkdir(parents=True)
    shutil.copytree(source, out / 'baseline' / 'source')
    baseline = {**catalog, 'exported_at': datetime.now(timezone.utc).isoformat(),
                'export_head': subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()}
    raw = encode(baseline)
    (out / 'baseline.json').write_bytes(raw)
    (out / 'baseline.sha256').write_text(digest(raw) + '\n')
    write_csv(out / 'review.csv', [row_for(b, baseline) for b in baseline['blocks']])
    (out / 'patches.json').write_bytes(encode({'format': FORMAT, 'patches': []}))
    (out / 'START-HERE.md').write_text(
        '# GoTu copy review\n\n'
        'Edit `review.csv` locally or import it into Google Sheets. Keep the first six columns intact. '
        'Blank Draft retains Current; use Decision `replace` for revisions, `remove` for intentional deletion, '
        'or `keep` to explicitly retain wording. Comments never become published text. '
        'Every comment needs a Resolution starting resolved: or deferred:, including requests deferred from this round.\n\n'
        'Chat with an agent using Block IDs. The agent reconciles the draft and prepares exact source patches '
        'in `patches.json`, linked to the changed blocks. Finalize only after the agreed copy and source diff '
        'have been reviewed. The scripts do not interpret comments or invent source bindings.\n\n'
        f"Source: {baseline['source']['url']}\n\nSource commit: `{baseline['source']['commit']}`. "
        'All source files are snapshotted and hashed in `baseline/`; example counts, identities and timestamps '
        'in copy are review renderings, not instructions to replace runtime values.\n')
    return {'package': str(out), 'blocks': len(ids), 'baseline_sha256': digest(raw)}

def load_baseline(package):
    package = Path(package).resolve()
    raw = (package / 'baseline.json').read_bytes()
    require(digest(raw) == (package / 'baseline.sha256').read_text().strip(), 'Baseline manifest changed')
    base = json.loads(raw)
    require(base.get('format') == FORMAT, 'Unsupported package format')
    check_tree(package / 'baseline' / 'source', base['source']['files'])
    return package, base

def reconcile(package, base):
    rows = csv_rows(package / 'review.csv')
    expected = {b['id']: row_for(b, base) for b in base['blocks']}
    seen, accepted, changes = set(), [], []
    for r in rows:
        bid = r['Block ID']
        require(bid in expected and bid not in seen, f'Unknown or duplicate block ID: {bid}')
        seen.add(bid)
        require(all(r[k] == expected[bid][k] for k in IMMUTABLE), f'{bid}: provenance/current copy changed')
        decision = r['Decision'].strip().lower()
        require(decision in ('', 'keep', 'replace', 'remove'), f'{bid}: invalid Decision')
        require(not r['Comments'].strip() or re.fullmatch(r'(?is)(resolved|deferred):\s*\S.*', r['Resolution'].strip()), f'{bid}: unresolved comment; Resolution must start resolved: or deferred:')
        draft, current = r['Draft copy (Markdown)'], r['Current copy (Markdown)']
        if decision == 'remove':
            require(not draft.strip(), f'{bid}: remove requires an empty Draft')
            final = ''
        elif decision == 'replace':
            require(draft.strip(), f'{bid}: replace requires Draft; use remove for deletion')
            final = draft
        else:
            require(not draft or draft == current, f'{bid}: changed Draft requires replace or remove')
            final = current
        # Match review annotations, not legitimate URL schemes or ordinary punctuation.
        require(not re.search(r'(?m)^\s*//|(?<!:)//[^\n]*\\{2,}', final), f'{bid}: inline comment remains in copy')
        item = {'id': bid, 'copy': final, 'comments': r['Comments'], 'resolution': r['Resolution'], 'decision': decision or 'keep'}
        accepted.append(item)
        if final != current:
            changes.append(bid)
    require(seen == set(expected), 'Review is missing blocks: ' + ', '.join(sorted(set(expected) - seen)))
    order = {b['id']: i for i, b in enumerate(base['blocks'])}
    accepted.sort(key=lambda r: order[r['id']])
    return accepted, set(changes)

def words(text, markup=False):
    text = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), text)
    text = re.sub(r"\\([\\'\"`/])", lambda m: m[1], text)
    text = re.sub(r'\\[nrt]', ' ', text)
    if markup:
        text = re.sub(r'</?[a-zA-Z][^>]*>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'(?m)^\s*(?:#{1,6} |[-*] |\d+\. |>)', '', text)
    text = text.replace('**', '').replace('`', '')
    # Markdown link presentation differs from HTML; check label and URL words.
    text = re.sub(r'\[([^]]+)\]\(([^)]+)\)', r'\1 \2', text)
    return re.findall(r"[\w]+(?:[’'][\w]+)*|[^\w\s]", text)

def verify_added_copy(base, accepted, patches, changed):
    old = {b['id']: b['copy'] for b in base['blocks']}
    for row in accepted:
        bid = row['id']
        if bid not in changed:
            continue
        source = [words(p['after'], True) for p in patches if bid in p['blocks']]
        before, after = words(old[bid]), words(row['copy'])
        for tag, a, b, c, d in difflib.SequenceMatcher(a=before, b=after, autojunk=False).get_opcodes():
            if tag not in ('insert', 'replace'):
                continue
            phrase = after[c:d]
            # Each added phrase must occur in a source patch associated with this block.
            require(any(any(tokens[i:i+len(phrase)] == phrase for i in range(len(tokens)-len(phrase)+1)) for tokens in source),
                    f'{bid}: final copy is absent from its source patches: ' + ' '.join(phrase))

def prepare_patches(package, base, changed, accepted):
    plan = read_json(package / 'patches.json')
    require(plan.get('format') == FORMAT, 'Unsupported patch format')
    outputs, covered, spans = {}, set(), {}
    for n, patch in enumerate(plan['patches'], 1):
        name = str(relative(patch['file']))
        require(name in base['source']['files'], f'Patch {n}: file is outside source snapshot')
        require(Path(name).suffix in ('.js', '.html', '.css'), f'Patch {n}: only text source may be patched')
        ids = patch['blocks']
        require(isinstance(ids, list) and ids and set(ids) <= changed, f'Patch {n}: link only changed block IDs')
        before, after = patch['before'], patch['after']
        require(isinstance(before, str) and isinstance(after, str) and before and before != after, f'Patch {n}: invalid replacement')
        text = (package / 'baseline' / 'source' / name).read_text()
        require(text.count(before) == 1, f'Patch {n}: before must match exactly once in {name}; include more context')
        start = text.index(before)
        spans.setdefault(name, []).append((start, start + len(before), after))
        covered.update(ids)
    require(covered == changed, 'Changed blocks lack source patches: ' + ', '.join(sorted(changed - covered)))
    for name, replacements in spans.items():
        replacements.sort()
        require(all(a[1] <= b[0] for a, b in zip(replacements, replacements[1:])), f'Overlapping patches in {name}')
        text = (package / 'baseline' / 'source' / name).read_text()
        for start, end, after in reversed(replacements):
            text = text[:start] + after + text[end:]
        outputs[name] = text
    for name, text in outputs.items():
        if name.endswith('.js'):
            require(shutil.which('node'), 'Node.js is required to syntax-check JavaScript patches')
            check = subprocess.run(['node', '--check'], input=text, text=True, capture_output=True)
            require(check.returncode == 0, f'Invalid JavaScript in {name}: ' + check.stderr)
    verify_added_copy(base, accepted, plan['patches'], changed)
    return outputs

def prepare(package):
    package, base = load_baseline(package)
    accepted, changed = reconcile(package, base)
    outputs = prepare_patches(package, base, changed, accepted)
    diff = ''
    for name, text in sorted(outputs.items()):
        before = (package / 'baseline' / 'source' / name).read_text()
        diff += ''.join(difflib.unified_diff(before.splitlines(True), text.splitlines(True),
                                             fromfile='baseline/' + name, tofile='proposed/' + name))
    return package, base, accepted, changed, outputs, diff

def preview(package, out=None):
    p, b, accepted, changed, outputs, diff = prepare(package)
    (p / 'preview.diff').write_text(diff)
    (p / 'preview-copy.json').write_bytes(encode(accepted))
    result = {'changed_blocks': sorted(changed), 'source_files': sorted(outputs), 'diff': str(p / 'preview.diff')}
    if out:
        out = Path(out).resolve()
        require(not out.exists(), f'Preview output already exists: {out}')
        ancestor = out.parent
        while not ancestor.exists():
            ancestor = ancestor.parent
        git = subprocess.run(['git', '-C', str(ancestor), 'rev-parse', '--show-toplevel'], capture_output=True)
        require(git.returncode != 0, 'Preview must be outside Git repositories to avoid accidental publication')
        destination = out / str(relative(b['source']['candidate']))
        shutil.copytree(p / 'baseline' / 'source', destination)
        for name, text in outputs.items():
            (destination / name).write_text(text)
        result.update(server_root=str(out), preview_path='/' + b['source']['candidate'] + '/about-demo/')
    return result

def finalize(package, approval, verification):
    require(approval.strip() and verification.strip(), 'Approval and verification references are required')
    p, base, accepted, changed, outputs, diff = prepare(package)
    require(not (p / 'finalized.json').exists(), 'Already finalized; export a new round instead of rewriting history')
    final = {'format': FORMAT, 'finalized_at': datetime.now(timezone.utc).isoformat(),
             'approval_reference': approval, 'verification_reference': verification,
             'baseline_sha256': digest((p / 'baseline.json').read_bytes()),
             'review_sha256': digest((p / 'review.csv').read_bytes()),
             'patches_sha256': digest((p / 'patches.json').read_bytes()),
             'accepted': accepted, 'changed_blocks': sorted(changed), 'outputs': outputs, 'diff': diff}
    raw = encode(final)
    (p / 'finalized.json').write_bytes(raw)
    (p / 'finalized.sha256').write_text(digest(raw) + '\n')
    (p / 'preview.diff').write_text(diff)
    return {'finalized': str(p / 'finalized.json'), 'sha256': digest(raw), 'changed_blocks': sorted(changed)}

def new_provenance(block, staged, source_name, target, parent_commit):
    url = block['provenance'].split(' | ')[0].replace('/' + source_name, '/' + target)
    locations = []
    for ref in block.get('source_refs', []):
        name = str(relative(ref['file']))
        text = (staged / name).read_text()
        if ref.get('symbol'):
            symbol = ref['symbol']
            matches = list(re.finditer(r'(?:function |const )' + re.escape(symbol) + r'(?:\s*=|\()', text))
            require(len(matches) == 1, f"Source anchor changed: {name} / {symbol}")
            line = text[:matches[0].start()].count('\n') + 1
            locations.append(f'{name}:{line} ({symbol})')
        else:
            locations.append(name + ' (shared shell)')
    return url + ' | ' + '; '.join(locations) + ' | Exact revision: baseline.json file hashes; unpublished source. Parent commit: ' + str(parent_commit)

def import_review(package, repo, target, apply=False):
    p, base = load_baseline(package)
    raw = (p / 'finalized.json').read_bytes()
    require(digest(raw) == (p / 'finalized.sha256').read_text().strip(), 'Finalized package changed')
    final = json.loads(raw)
    require(final['format'] == FORMAT, 'Unsupported finalization format')
    for name, key in [('baseline.json', 'baseline_sha256'), ('review.csv', 'review_sha256'), ('patches.json', 'patches_sha256')]:
        require(digest((p / name).read_bytes()) == final[key], f'{name} changed after finalization')
    # Re-derive outputs; no trusting a supplied payload merely because its checksum matches.
    _, _, accepted, changed, outputs, diff = prepare(p)
    require(final['outputs'] == outputs and final['accepted'] == accepted and final['diff'] == diff,
            'Finalized payload differs from reviewed inputs')
    repo = Path(repo).resolve()
    source_name = str(relative(base['source']['candidate']))
    source = repo / source_name
    require(source.resolve().is_relative_to(repo), 'Source escapes repository')
    check_tree(source, base['source']['files'])
    require(re.fullmatch(r'gotu/mirror-demo-v[1-9]\d*', target), 'Target must be gotu/mirror-demo-vN')
    destination = repo / target
    require(destination.parent.resolve().is_relative_to(repo), 'Target escapes repository')
    require(not destination.exists() and not destination.is_symlink(), 'Target exists; published candidates cannot be overwritten')
    result = {'target': str(destination), 'changed_blocks': sorted(changed), 'mode': 'apply' if apply else 'dry-run'}
    if not apply:
        return result
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='gotu-copy-import-', dir=destination.parent) as temp:
        staged = Path(temp) / 'candidate'
        shutil.copytree(source, staged)
        for name, text in outputs.items():
            (staged / name).write_text(text)
        # Repoint local assets/routes only; original candidate remains byte-for-byte intact.
        for file in staged.rglob('*'):
            if file.is_file() and file.suffix in ('.html', '.js', '.css'):
                file.write_text(file.read_text().replace('/' + source_name, '/' + target))
        new_catalog = {**base, 'source': {**base['source'], 'candidate': target,
                       'commit': None, 'parent_commit': base['source']['commit'],
                       'url': base['source']['url'].replace('/' + source_name, '/' + target),
                       'publication_status': 'unpublished',
                       'files': files(staged)},
                       'blocks': [{**block, 'copy': accepted[i]['copy'],
                                   'provenance': new_provenance(block, staged, source_name, target, base['source']['commit'])}
                                  for i, block in enumerate(base['blocks'])],
                       'round_trip': {'finalized_sha256': digest(raw), 'parent_candidate': source_name}}
        # Preflight again immediately before the new directory becomes visible.
        check_tree(source, base['source']['files'])
        require(not destination.exists(), 'Target appeared during import')
        staged.rename(destination)
    (p / 'imported-catalog.json').write_bytes(encode(new_catalog))
    receipt = {**result, 'imported_at': datetime.now(timezone.utc).isoformat(),
               'finalized_sha256': digest(raw), 'files': new_catalog['source']['files'],
               'catalog': str(p / 'imported-catalog.json')}
    (p / 'import-receipt.json').write_bytes(encode(receipt))
    return receipt

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subs = parser.add_subparsers(dest='command', required=True)
    e = subs.add_parser('export'); e.add_argument('--repo', required=True); e.add_argument('--catalog', required=True); e.add_argument('--out', required=True)
    v = subs.add_parser('preview'); v.add_argument('package'); v.add_argument('--out')
    f = subs.add_parser('finalize'); f.add_argument('package'); f.add_argument('--approval-reference', required=True); f.add_argument('--verification-reference', required=True)
    i = subs.add_parser('import'); i.add_argument('package'); i.add_argument('--repo', required=True); i.add_argument('--target', required=True); i.add_argument('--apply', action='store_true')
    a = parser.parse_args()
    try:
        if a.command == 'export': result = export_review(a.repo, a.catalog, a.out)
        elif a.command == 'preview': result = preview(a.package, a.out)
        elif a.command == 'finalize': result = finalize(a.package, a.approval_reference, a.verification_reference)
        else: result = import_review(a.package, a.repo, a.target, a.apply)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except (ReviewError, OSError, ValueError, KeyError, TypeError) as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
