import csv
import importlib.util
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('workflow', Path(__file__).with_name('copy_roundtrip.py'))
w = importlib.util.module_from_spec(spec); spec.loader.exec_module(w)

class RoundTrip(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name); self.repo = self.root / 'repo'; self.repo.mkdir()
        subprocess.run(['git', 'init', '-q', str(self.repo)], check=True)
        subprocess.run(['git', '-C', str(self.repo), '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '-qm', 'fixture'], check=True)
        self.source = self.repo / 'gotu/mirror-demo-v10'; self.source.mkdir(parents=True)
        (self.source / 'app.js').write_text("const BASE='/gotu/mirror-demo-v10';\nconst heading='Welcome';\n")
        (self.source / 'index.html').write_text('<!doctype html><script src="/gotu/mirror-demo-v10/app.js"></script>')
        self.catalog = self.root / 'catalog.json'
        self.catalog.write_bytes(w.encode({'format': w.FORMAT, 'source': {'candidate': 'gotu/mirror-demo-v10', 'commit': 'fixture', 'url': 'https://example.invalid/gotu/mirror-demo-v10/', 'files': w.files(self.source)}, 'blocks': [{'id': 'welcome', 'order': 1, 'page': 'Welcome', 'section': 'Opening', 'provenance': 'app.js:2', 'copy': '# Welcome'}]}))
        self.package = self.root / 'review'; w.export_review(self.repo, self.catalog, self.package)
    def edit(self, **updates):
        rows = w.csv_rows(self.package / 'review.csv'); rows[0].update(updates); w.write_csv(self.package / 'review.csv', rows)
    def proposal(self):
        self.edit(**{'Draft copy (Markdown)': '# Come on in', 'Decision': 'replace', 'Comments': 'Make it warmer.', 'Resolution': 'resolved: Use the agreed invitation.'})
        (self.package / 'patches.json').write_bytes(w.encode({'format': w.FORMAT, 'patches': [{'blocks': ['welcome'], 'file': 'app.js', 'before': "const heading='Welcome';", 'after': "const heading='Come on in';"}]}))
    def seal(self):
        return w.finalize(self.package, 'Fixture approval, test only', 'Fixture assertion, test only')
    def apply(self):
        return w.import_review(self.package, self.repo, 'gotu/mirror-demo-v11', True)
    def test_two_successive_rounds(self):
        baseline = w.files(self.source); self.proposal(); self.seal()
        r = w.import_review(self.package, self.repo, 'gotu/mirror-demo-v11')
        self.assertEqual(r['mode'], 'dry-run'); self.assertFalse((self.repo / 'gotu/mirror-demo-v11').exists())
        self.apply(); self.assertEqual(w.files(self.source), baseline)
        new = self.repo / 'gotu/mirror-demo-v11'; self.assertIn('Come on in', (new / 'app.js').read_text()); self.assertNotIn('v10', (new / 'index.html').read_text())
        next_package = self.root / 'second-review'
        w.export_review(self.repo, self.package / 'imported-catalog.json', next_package)
        self.assertEqual(w.csv_rows(next_package / 'review.csv')[0]['Current copy (Markdown)'], '# Come on in')
        w.finalize(next_package, 'Fixture approval', 'Fixture validation')
        w.import_review(next_package, self.repo, 'gotu/mirror-demo-v12', True)
    def test_real_v10_catalog_roundtrip(self):
        tool = Path(__file__).parent
        repo = tool.parent.parent
        shutil.copytree(repo / 'gotu/mirror-demo-v10', self.source, dirs_exist_ok=True)
        self.package = self.root / 'real-review'
        w.export_review(self.repo, tool / 'catalogs/v10.json', self.package)
        rows = w.csv_rows(self.package / 'review.csv')
        self.assertEqual(len(rows), 164)
        row = next(r for r in rows if r['Block ID'] == 'COPYBLOCK-012')
        row.update({'Draft copy (Markdown)': row['Current copy (Markdown)'].replace('**Get started**', '**Begin here**'), 'Decision': 'replace'})
        w.write_csv(self.package / 'review.csv', rows)
        (self.package / 'patches.json').write_bytes(w.encode({'format': w.FORMAT, 'patches': [{'blocks': ['COPYBLOCK-012'], 'file': 'app.js', 'before': "btn('Get started','begin-onboarding'", 'after': "btn('Begin here','begin-onboarding'"}]}))
        old = w.files(self.source)
        w.preview(self.package, self.root / 'preview')
        self.assertFalse((self.package / 'finalized.json').exists())
        self.seal(); self.apply()
        self.assertEqual(w.files(self.source), old)
        second = self.root / 'second-real-review'
        w.export_review(self.repo, self.package / 'imported-catalog.json', second)
        updated = next(r for r in w.csv_rows(second / 'review.csv') if r['Block ID'] == 'COPYBLOCK-012')
        self.assertIn('**Begin here**', updated['Current copy (Markdown)'])
        self.assertIn('app.js:', updated['Provenance'])
    def test_preview_repository_refused(self):
        with self.assertRaisesRegex(w.ReviewError, 'outside Git repositories'):
            w.preview(self.package, self.repo / 'preview')
    def test_blank_draft_keeps_current(self):
        self.seal(); self.apply(); self.assertIn("heading='Welcome'", (self.repo / 'gotu/mirror-demo-v11/app.js').read_text())
    def test_explicit_deletion(self):
        self.edit(**{'Decision': 'remove'})
        (self.package / 'patches.json').write_bytes(w.encode({'format': w.FORMAT, 'patches': [{'blocks':['welcome'],'file':'app.js','before':"const heading='Welcome';",'after':"const heading='';"}]}))
        self.seal(); self.apply(); self.assertIn("heading=''", (self.repo / 'gotu/mirror-demo-v11/app.js').read_text())
    def test_unresolved_comment(self):
        self.edit(**{'Comments': 'Question needs an answer'})
        with self.assertRaisesRegex(w.ReviewError, 'unresolved comment'): self.seal()
    def test_changed_draft_without_decision(self):
        self.edit(**{'Draft copy (Markdown)': 'Different'})
        with self.assertRaisesRegex(w.ReviewError, 'requires replace'): self.seal()
    def test_preserve_metadata(self):
        self.edit(**{'Current copy (Markdown)': 'Tampered baseline'})
        with self.assertRaisesRegex(w.ReviewError, 'provenance/current copy changed'): self.seal()
    def test_missing_id(self):
        w.write_csv(self.package / 'review.csv', [])
        with self.assertRaisesRegex(w.ReviewError, 'missing blocks'): self.seal()
    def test_duplicate_id(self):
        rows = w.csv_rows(self.package / 'review.csv'); w.write_csv(self.package / 'review.csv', rows * 2)
        with self.assertRaisesRegex(w.ReviewError, 'duplicate block'): self.seal()
    def test_header_corruption(self):
        p=self.package/'review.csv';p.write_text(p.read_text().replace('Block ID','ID',1))
        with self.assertRaisesRegex(w.ReviewError, 'headers changed'): self.seal()
    def test_inline_comment(self):
        self.proposal(); self.edit(**{'Draft copy (Markdown)': '// unresolved comment'})
        with self.assertRaisesRegex(w.ReviewError, 'inline comment'): self.seal()
    def test_legitimate_url(self):
        self.proposal(); self.edit(**{'Draft copy (Markdown)': 'https://example.invalid/a//b'})
        p=self.package/'patches.json';x=w.read_json(p);x['patches'][0]['after']="const heading='https://example.invalid/a//b';";p.write_bytes(w.encode(x))
        self.seal()
    def test_mismatched_final_copy(self):
        self.proposal();self.edit(**{'Draft copy (Markdown)':'# Wrong proposed heading'})
        with self.assertRaisesRegex(w.ReviewError,'final copy is absent'):self.seal()
    def test_unmapped_edit(self):
        self.edit(**{'Draft copy (Markdown)': 'New', 'Decision': 'replace'})
        with self.assertRaisesRegex(w.ReviewError, 'lack source patches'): self.seal()
    def test_ambiguous_patch(self):
        self.proposal();p=self.package/'patches.json';x=w.read_json(p);x['patches'][0]['before']='const';p.write_bytes(w.encode(x))
        with self.assertRaisesRegex(w.ReviewError, 'exactly once'): self.seal()
    def test_invalid_javascript(self):
        self.proposal();p=self.package/'patches.json';x=w.read_json(p);x['patches'][0]['after']="const heading='Come on in;";p.write_bytes(w.encode(x))
        with self.assertRaisesRegex(w.ReviewError,'Invalid JavaScript'):self.seal()
    def test_patch_traversal(self):
        self.proposal();p=self.package/'patches.json';x=w.read_json(p);x['patches'][0]['file']='../outside';p.write_bytes(w.encode(x))
        with self.assertRaisesRegex(w.ReviewError, 'Unsafe relative path'): self.seal()
    def test_source_conflict(self):
        self.proposal(); self.seal(); (self.source / 'app.js').write_text('changed independently')
        with self.assertRaisesRegex(w.ReviewError, 'baseline changed'): self.apply()
    def test_export_conflict(self):
        (self.source / 'app.js').write_text('changed independently')
        with self.assertRaisesRegex(w.ReviewError, 'baseline changed'): w.export_review(self.repo,self.catalog,self.root/'other')
    def test_review_after_finalize(self):
        self.proposal();self.seal();self.edit(**{'Comments':'Late comment'})
        with self.assertRaisesRegex(w.ReviewError,'changed after finalization'):self.apply()
    def test_finalized_tampering(self):
        self.proposal();self.seal();p=self.package/'finalized.json';p.write_text(p.read_text()+' ')
        with self.assertRaisesRegex(w.ReviewError,'Finalized package changed'):self.apply()
    def test_previous_version_preserved(self):
        self.proposal();self.seal()
        with self.assertRaisesRegex(w.ReviewError,'cannot be overwritten'):w.import_review(self.package,self.repo,'gotu/mirror-demo-v10',True)
    def test_second_import_refused(self):
        self.proposal();self.seal();self.apply()
        with self.assertRaisesRegex(w.ReviewError,'cannot be overwritten'):self.apply()
    def test_finalization_not_rewritten(self):
        self.seal()
        with self.assertRaisesRegex(w.ReviewError,'Already finalized'):self.seal()
    def test_export_outside_public_repository(self):
        with self.assertRaisesRegex(w.ReviewError,'outside the public'):w.export_review(self.repo,self.catalog,self.repo/'review')

if __name__ == '__main__': unittest.main()
