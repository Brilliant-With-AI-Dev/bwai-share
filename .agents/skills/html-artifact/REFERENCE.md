# HTML Artifact — Reference

Reusable building blocks for the six archetypes in [SKILL.md](SKILL.md). Copy, then adapt.

## Base template

Start every artifact from this skeleton. Strip what you don't need.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{TITLE}}</title>
    <style>
      :root {
        /* Light editorial base: serif headings, vivid Bold blue/gold accents,
           pure white surfaces. Severity colors stay functional. */
        --bg: #ffffff;
        --surface: #ffffff;
        --canvas: #f6f7f9; /* subtle, for code blocks and audit bg */
        --border: #d8dce1;
        --border-strong: #afb8c1;
        --text: #0e1116; /* near-black ink */
        --muted: #5b6470;
        --ink: #0e1116; /* dark fill — table headers, etc. */
        --accent: #0b5fff; /* Bold editorial blue */
        --accent-soft: #eaf1ff;
        --accent-strong: #0a47c2;
        --gold: #e0a400; /* secondary accent */
        --gold-soft: #fff5d6;
        --info: #5b6470;
        --warn: #a65a00;
        --warn-soft: #ffeccc;
        --crit: #c91f1f;
        --crit-soft: #ffe0e0;
        --ok: #0a7d33;
        --ok-soft: #d8f5e0;
        --code-bg: #f6f7f9;
        /* Serif headings (system stack, no webfont) + sans body. */
        --serif:
          "Iowan Old Style", Georgia, "Palatino Linotype", Palatino,
          "Times New Roman", serif;
        --sans:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --shadow:
          0 1px 0 rgba(14, 17, 22, 0.04), 0 1px 3px rgba(14, 17, 22, 0.06);
      }
      * {
        box-sizing: border-box;
      }
      html {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      html,
      body {
        margin: 0;
        padding: 0;
        /* Bug-1 guard: never let a wide child widen the PAGE. Wide content
           scrolls inside its own box; the page itself never scrolls sideways. */
        max-width: 100%;
        overflow-x: hidden;
      }
      body {
        font-family: var(--sans);
        font-size: 15px;
        line-height: 1.55;
        color: var(--text);
        background: var(--bg);
        padding: 40px 24px 80px;
      }
      main {
        max-width: 1080px;
        margin: 0 auto;
        /* grid/flex children default to min-width:auto and refuse to shrink
           below content — which is what lets a wide table push the page wide.
           Force min-width:0 here and on any grid child (.layout > *). */
        min-width: 0;
      }
      /* Serif h1/h2 = editorial voice; sans body + sans h3-labels = readability. */
      h1,
      h2 {
        font-family: var(--serif);
      }
      h1 {
        font-size: 30px;
        margin: 0 0 4px;
        letter-spacing: -0.01em;
      }
      h2 {
        font-size: 21px;
        margin: 32px 0 12px;
        letter-spacing: -0.005em;
      }
      h3 {
        font-size: 15px;
        margin: 20px 0 6px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      p {
        margin: 0 0 12px;
      }
      .meta {
        color: var(--muted);
        font-size: 13px;
        margin-bottom: 28px;
      }
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        box-shadow: var(--shadow);
      }
      code,
      pre {
        font-family: "SF Mono", Menlo, Consolas, monospace;
        font-size: 13px;
      }
      pre {
        background: var(--code-bg);
        padding: 14px 16px;
        border-radius: 8px;
        overflow-x: auto;
      }
      code {
        background: var(--code-bg);
        padding: 1px 6px;
        border-radius: 4px;
      }
      pre code {
        background: transparent;
        padding: 0;
      }
      img,
      svg,
      table,
      pre {
        max-width: 100%;
      }
      /* Wrap every <table> in this. On desktop it scrolls inside its box
         instead of widening the page; below 720px it collapses to compact
         cards (see the @media block). The wrapper is capped to the viewport
         (Bug-1 guard); the table itself must NOT be capped on desktop, or it
         can never overflow and the wrapper won't scroll. */
      .table-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        max-width: 100%;
      }
      .table-scroll table {
        max-width: none;
        border-collapse: collapse;
        width: 100%;
        font-size: 14px;
      }
      .table-scroll th,
      .table-scroll td {
        text-align: left;
        padding: 8px 12px;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
      }
      /* Dark editorial header band. */
      .table-scroll th {
        background: var(--ink);
        color: #fff;
        font-weight: 700;
        white-space: nowrap;
      }
      .table-scroll tr:hover td {
        background: var(--canvas);
      }
      .badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 600;
      }
      .badge.info {
        background: #e2e8f0;
        color: #334155;
      }
      .badge.warn {
        background: #fef3c7;
        color: #92400e;
      }
      .badge.crit {
        background: #fee2e2;
        color: #991b1b;
      }
      .badge.ok {
        background: #dcfce7;
        color: #166534;
      }
      button {
        font: inherit;
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--text);
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
      }
      button:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
      button.primary {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
      }
      /* 16px minimum on every editable control — below 16px iOS Safari
         zooms the page on focus and the layout jumps. Non-negotiable. */
      input,
      textarea,
      select {
        font-size: 16px;
        font-family: inherit;
      }
      .toolbar {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 16px;
      }
      /* Every grid/flex child must be allowed to shrink, or a wide table
         inside it widens the page (Bug-1). Applies to the sticky-TOC
         .layout and any author grid. */
      .layout > * {
        min-width: 0;
      }
      /* Data tables -> compact cards below 720px. Hide the header row, render
         each row as a card, each cell as a tight LABEL | value line. The JS
         in <script> tags cells from their <th> at runtime (no per-cell work)
         and marks the headline + id columns. A primary text column becomes
         the card title; an id column becomes a small accent line. This beats
         a tiny sideways-scrolling grid for many-column tables. */
      @media (max-width: 720px) {
        .table-scroll {
          border: none;
          overflow: visible;
        }
        .table-scroll table,
        .table-scroll tbody,
        .table-scroll tr,
        .table-scroll td {
          display: block;
          width: auto;
          max-width: 100%;
        }
        .table-scroll thead {
          display: none;
        }
        .table-scroll tr {
          border: 1px solid var(--border);
          border-left: 4px solid var(--accent);
          border-radius: 10px;
          background: var(--surface);
          box-shadow: var(--shadow);
          padding: 9px 12px 10px;
          margin: 0 0 10px;
        }
        .table-scroll tr:hover td {
          background: transparent;
        }
        /* short fields: tight label | value grid, one line each */
        .table-scroll td {
          display: grid;
          grid-template-columns: 96px 1fr;
          gap: 10px;
          padding: 2px 0;
          border: none;
          font-size: 14px;
          align-items: start;
          overflow-wrap: anywhere;
        }
        .table-scroll td::before {
          content: attr(data-label);
          font-family: var(--sans);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--muted);
          font-weight: 700;
          padding-top: 2px;
        }
        .table-scroll td:empty {
          display: none;
        }
        /* primary text column = card headline (bold, no label) */
        .table-scroll td.c-head {
          display: block;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .table-scroll td.c-head::before {
          display: none;
        }
        /* id column = small accent line */
        .table-scroll td.c-id {
          display: block;
          color: var(--accent);
          font-family: var(--sans);
          font-weight: 800;
          font-size: 12px;
          margin-bottom: 1px;
        }
        .table-scroll td.c-id::before {
          display: none;
        }
      }
      @media (max-width: 600px) {
        body {
          padding: 24px 16px 64px;
        }
        h1 {
          font-size: 24px;
        }
        /* tap targets ≥ 40px on phones; keep desktop dense */
        button,
        .chip,
        input,
        select,
        textarea {
          min-height: 40px;
        }
        .toolbar {
          flex-wrap: wrap;
        }
      }
      @media print {
        body {
          background: white;
          padding: 0;
        }
        .no-print,
        button {
          display: none !important;
        }
        .card {
          box-shadow: none;
          border-color: #ccc;
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>{{TITLE}}</h1>
      <p class="meta">Generated {{DATE}} · {{CONTEXT}}</p>
      {{CONTENT}}
    </main>
    <script>
      function copyText(text, button) {
        navigator.clipboard.writeText(text).then(() => {
          const old = button.textContent;
          button.textContent = "Copied";
          setTimeout(() => {
            button.textContent = old;
          }, 1200);
        });
      }
      /* Tag every .table-scroll cell with its column header (data-label) and
         mark the headline / id columns, so the compact-card @media block has
         labels and a title to work with. Zero per-cell authoring effort.
         Tune HEAD / IDC keywords to your table's headers if needed. */
      (function () {
        var HEAD = [
            "decision",
            "item",
            "problem",
            "risk",
            "question",
            "action",
            "opportunity",
            "candidate",
            "finding",
            "name",
          ],
          IDC = ["#", "id", "rank"];
        document.querySelectorAll(".table-scroll table").forEach(function (t) {
          var ths = Array.prototype.map.call(
            t.querySelectorAll("thead th"),
            function (x) {
              return x.textContent.trim();
            },
          );
          var lc = ths.map(function (s) {
            return s.toLowerCase();
          });
          t.querySelectorAll("tbody tr").forEach(function (tr) {
            Array.prototype.forEach.call(tr.children, function (td, i) {
              if (ths[i]) td.setAttribute("data-label", ths[i]);
              if (IDC.indexOf(lc[i]) > -1) td.classList.add("c-id");
              else if (HEAD.indexOf(lc[i]) > -1) td.classList.add("c-head");
            });
          });
        });
      })();
    </script>
  </body>
</html>
```

## Palette

Light editorial base: pure white page + surface, **serif h1/h2** over a **sans body**, and vivid Bold blue/gold accents. No warm tinting, no gradients — flat color only. High contrast (text ~20:1 against bg). Accent carries emphasis and active state; severity colors carry meaning, not decoration.

| Token             | Hex       | Use                                                     |
| ----------------- | --------- | ------------------------------------------------------- |
| `--bg`            | `#ffffff` | Page background (pure white)                            |
| `--surface`       | `#ffffff` | Card background (same as bg — flat)                     |
| `--canvas`        | `#f6f7f9` | Code blocks, audit aside, subtle fills, row-hover       |
| `--border`        | `#d8dce1` | Default hairlines                                       |
| `--border-strong` | `#afb8c1` | Heavier rules where needed                              |
| `--text`          | `#0e1116` | Body text (near-black ink)                              |
| `--muted`         | `#5b6470` | Secondary text                                          |
| `--ink`           | `#0e1116` | Dark fill — table header band, dark chips               |
| `--accent`        | `#0b5fff` | Links, primary buttons, focus, "why" accent (Bold blue) |
| `--accent-soft`   | `#eaf1ff` | Sparing tint for accent-emphasized panels               |
| `--accent-strong` | `#0a47c2` | Hover / pressed accent                                  |
| `--gold`          | `#e0a400` | Secondary accent (highlights, second series)            |
| `--gold-soft`     | `#fff5d6` | Gold badge / highlight background                       |
| `--info`          | `#5b6470` | Severity: info (= muted)                                |
| `--warn`          | `#a65a00` | Severity: warn (vivid amber)                            |
| `--warn-soft`     | `#ffeccc` | Warn badge background                                   |
| `--crit`          | `#c91f1f` | Severity: critical (danger red)                         |
| `--crit-soft`     | `#ffe0e0` | Crit badge background                                   |
| `--ok`            | `#0a7d33` | Severity: ok / passing (success green)                  |
| `--ok-soft`       | `#d8f5e0` | Ok badge background                                     |
| `--code-bg`       | `#f6f7f9` | Inline and block code background                        |

| Font token | Stack                                                                 | Use                              |
| ---------- | --------------------------------------------------------------------- | -------------------------------- |
| `--serif`  | `"Iowan Old Style", Georgia, "Palatino Linotype", Palatino, …, serif` | h1, h2 (editorial voice)         |
| `--sans`   | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`   | body, h3-labels, UI, code-labels |

All fonts are **system stacks — no webfont, no network.** `Iowan Old Style` ships on macOS/iOS; the stack degrades to Georgia/Palatino elsewhere. Keep monospace (`"SF Mono", Menlo, …`) for code.

**Table headers are a dark `--ink` band** (white text). **Badges are squared** (`border-radius: 5px`), not pills — part of the editorial look.

**The vivid-left-border idiom.** Default to white backgrounds with a 4px left border in the relevant accent color, rather than tinted full backgrounds. Keeps the page bright and the accents punchy. Reserve filled-tint backgrounds (the `_soft` colors) for inline badges and TL;DR / overview cards where the panel itself is the point. No gradients on surfaces — flat color only.

**Reverting to the plain GitHub-light look.** If an artifact reads better flat/technical (some code reviews), override in that file's `:root`: `--accent:#0969da; --text:#1f2328; --border:#d0d7de`, set `h1,h2{font-family:var(--sans)}`, and give `.table-scroll th` a light background. The editorial palette is the default, not a mandate.

## Sticky TOC + 2-column layout (for reports with 5+ sections)

When the artifact has more than five sections, wrap content in a 2-column grid with a sticky table-of-contents in the left rail. This is the canonical layout primitive; do not reinvent it per artifact.

```html
<div class="layout">
  <nav class="toc">
    <h3>Sections</h3>
    <ol>
      <li><a href="#s1">First section</a></li>
      <li><a href="#s2">Second section</a></li>
      <!-- … -->
    </ol>
  </nav>
  <main>
    <!-- artifact content -->
  </main>
</div>
```

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  gap: 32px;
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  nav.toc {
    position: static !important;
  }
}
nav.toc {
  position: sticky;
  top: 24px;
  align-self: start;
  font-size: 13px;
}
nav.toc h3 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 10px;
}
nav.toc ol {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: sec;
}
nav.toc li {
  counter-increment: sec;
  margin: 4px 0;
}
nav.toc a {
  color: var(--muted);
  text-decoration: none;
  display: block;
  padding: 4px 8px;
  border-radius: 6px;
  border-left: 2px solid transparent;
}
nav.toc a::before {
  content: counter(sec) ".";
  display: inline-block;
  width: 22px;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
nav.toc a:hover {
  background: var(--surface);
  color: var(--text);
  border-left-color: var(--accent);
}
@media print {
  nav.toc {
    display: none;
  }
  .layout {
    display: block;
    padding: 0;
  }
}
```

## Heading hierarchy convention

To keep typographic scale consistent across all archetypes:

- **`<h1>`** — the artifact title. One per file.
- **`<h2>`** — top-level section titles (numbered when the artifact has a TOC).
- **`<h3>`** — section-internal subheadings (Files & commands, Why, Pros, Cons, etc.). 11px uppercase muted.
- **`<h4>`** — micro-labels inside callouts and small cards (Trade-off, Common mistake, Runner-up). Same 11px uppercase visual style as `<h3>` but used semantically when nested two levels deep. Both render at the same visual size; the distinction is structural.

If you don't need the nesting distinction, use `<h3>` throughout. Don't switch back and forth without reason.

## Severity badges

```html
<span class="badge info">info</span>
<span class="badge warn">warn</span>
<span class="badge crit">critical</span>
<span class="badge ok">ok</span>
```

## Export button (universal pattern)

```html
<div class="toolbar no-print">
  <button class="primary" id="export-json">Copy as JSON</button>
  <button id="export-md">Copy as Markdown</button>
</div>
<script>
  const data = {
    /* fill from page state */
  };
  document.getElementById("export-json").onclick = (e) =>
    copyText(JSON.stringify(data, null, 2), e.target);
  document.getElementById("export-md").onclick = (e) =>
    copyText(toMarkdown(data), e.target);
  function toMarkdown(d) {
    /* archetype-specific */
  }
</script>
```

---

## Archetype 1 — Comparison grid

For: N approaches side by side with labeled tradeoffs.

```html
<section>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;"
  >
    <article class="card">
      <h2 style="margin-top:0;">
        Option A — <span class="badge ok">recommended</span>
      </h2>
      <p>One-line summary.</p>
      <h3>Pros</h3>
      <ul>
        <li>...</li>
      </ul>
      <h3>Cons</h3>
      <ul>
        <li>...</li>
      </ul>
      <h3>Effort</h3>
      <p>~2 days</p>
    </article>
    <!-- repeat per option -->
  </div>
</section>
```

Rules: exactly one option marked `recommended`. Cards must be the same height visually — pad short options with empty `<h3>Notes</h3>` if needed. Include an export button that emits a Markdown decision table.

## Archetype 2 — Implementation plan

For: a plan the user will share with another engineer or paste back to Claude in a new session.

Sections in order: Summary · Mockup (SVG or inline screenshot data URI) · Data flow (SVG arrows or `<pre>` ASCII) · Steps (ordered list with file:line references) · Annotated code snippets · Open questions.

```html
<section>
  <h2>Data flow</h2>
  <svg
    viewBox="0 0 600 160"
    role="img"
    aria-label="Data flow diagram"
    style="width:100%; height:auto; background:var(--surface); border:1px solid var(--border); border-radius:12px;"
  >
    <rect
      x="20"
      y="40"
      width="140"
      height="80"
      rx="8"
      fill="var(--accent-soft)"
      stroke="var(--accent)"
    />
    <text x="90" y="86" text-anchor="middle" font-size="14">Client</text>
    <path d="M160 80 L 240 80" stroke="var(--muted)" marker-end="url(#arrow)" />
    <!-- defs for marker arrow -->
  </svg>
</section>
```

Always include code snippets with file paths as captions:

```html
<figure>
  <figcaption><code>src/lib/auth.ts:42</code></figcaption>
  <pre><code>export function refreshToken() { ... }</code></pre>
</figure>
```

## Archetype 3 — Code review

For: PR review output. Show the diff, not a prose summary.

```html
<article class="card" style="padding: 0; overflow: hidden;">
  <header
    style="padding: 12px 16px; border-bottom: 1px solid var(--border); background: var(--code-bg);"
  >
    <code>src/api/handler.ts</code>
    <span class="badge crit" style="float: right;">2 critical</span>
  </header>
  <div class="review-row">
    <pre
      style="margin: 0; border-radius: 0;"
    ><code><span style="background:#fee2e2;">- old line</span>
<span style="background:#dcfce7;">+ new line</span></code></pre>
    <aside style="border-left: 1px solid var(--border); padding: 12px;">
      <p>
        <span class="badge crit">critical</span> Race condition between line 42
        and 47 — refreshToken can fire twice.
      </p>
    </aside>
  </div>
</article>
```

```css
.review-row {
  display: grid;
  grid-template-columns: 1fr 320px;
}
@media (max-width: 700px) {
  /* annotations drop below the diff; the diff keeps its own
     horizontal scroll via the base `pre { overflow-x: auto }` */
  .review-row {
    grid-template-columns: 1fr;
  }
  .review-row aside {
    border-left: none;
    border-top: 1px solid var(--border);
  }
}
```

Severity counts in the file header. Inline annotations in the right rail aligned to the line they reference. Export as a JSON list of `{file, line, severity, comment}`.

## Archetype 4 — Report / explainer

For: "how X works", incident write-ups, weekly status, synthesized research, opinionated playbooks.

Structure (in order):

1. **Plain English overview card** (mixed-audience reports only — see below).
2. **State-delta block** (mixed-audience reports only — see below).
3. **TL;DR** card for technical readers.
4. **Sticky TOC** if more than 5 sections.
5. **Diagram(s)** — ASCII first, SVG only when justified.
6. **Sections** using the **opinion block** sub-pattern (below).
7. **Evidence** — quotes, links, source citations.
8. **What changes from here** — concrete next steps or hand-off.

```html
<aside
  class="card"
  style="background: var(--accent-soft); border-color: var(--accent);"
>
  <h3 style="color: var(--accent); margin-top: 0;">TL;DR</h3>
  <p>
    The rate limiter trips when more than 50 sessions hit the same tenant in
    10s. Root cause: shared bucket key.
  </p>
</aside>
```

### Plain English opening (mixed-audience reports)

If the artifact will be read by anyone non-technical — an executive, a client, your own future self while context-switching — open with two blocks **before** the TL;DR: an overview card and a state-delta block. The TL;DR uses domain language for engineers; these two blocks use the language a smart non-engineer uses.

#### Overview card

Answers three questions, in this order, in plain English. No acronyms on first appearance. No internal jargon.

```html
<section class="overview">
  <div class="overview-row">
    <h3>What this is</h3>
    <p>
      A setup guide for keeping your AI coding tools all reading from the same
      instructions, so they don't drift apart over time.
    </p>
  </div>
  <div class="overview-row">
    <h3>Who it's for</h3>
    <p>
      Solo developers and small teams who use more than one AI coding assistant.
    </p>
  </div>
  <div class="overview-row">
    <h3>What you get if you follow it</h3>
    <p>
      One file to edit when your conventions change. New machines come online in
      30 minutes instead of a day. No silent drift between tools.
    </p>
  </div>
</section>
```

Language rules for this card:

- **Translate every acronym** before using it. "MCP servers" → "external tools your assistant can call". Introduce the acronym later if needed.
- **Concrete user-facing outcomes** beat abstract benefits. "New machines online in 30 minutes" beats "improved DX". "No silent drift" beats "consistency guarantees".
- **No conditional language.** "What you get" is what they get, not "what you may get if your config is correct".
- **Two short sentences per answer max.** If you need more, the doc is misnamed and you're writing a different artifact.

#### State-delta block (Today / After / Why it matters)

Three swimlanes. Each lane has 3–5 bullets, no nesting, recognizable items.

```html
<section class="state-delta">
  <div class="lane today">
    <h3>Today</h3>
    <ul>
      <li>Three config files getting out of sync.</li>
      <li>New machine setup takes a day of trial and error.</li>
      <li>Hooks fire twice and you don't know why.</li>
    </ul>
  </div>
  <div class="lane after">
    <h3>After</h3>
    <ul>
      <li>One file, symlinked everywhere.</li>
      <li>30-minute fresh-machine bootstrap, verbatim.</li>
      <li>Every hook in one place, fires once.</li>
    </ul>
  </div>
  <div class="lane why">
    <h3>Why it matters</h3>
    <ul>
      <li>Less time fighting your tools.</li>
      <li>Move between machines without losing your setup.</li>
      <li>Trust what your assistant tells you.</li>
    </ul>
  </div>
</section>
```

Lane rules:

- **Today** is recognizable pain. The reader should think "yes, that's me" or "yes, that's the team". If they don't recognize it, the framing is off.
- **After** is the same items, resolved. One-to-one mapping where possible. Concrete, not aspirational. "30-minute bootstrap" not "faster onboarding".
- **Why it matters** is the so-what, in the reader's own life. Not "improves maintainability" (engineer-speak). "Trust what your assistant tells you" (everyone-speak).
- **Never include items that only the technical reader can verify.** The non-technical reader is supposed to take the After lane at face value; the TL;DR and sections below are where engineers check the work.

CSS for both blocks (add to `<style>`):

```css
.overview {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px 26px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
}
.overview-row {
  margin-bottom: 14px;
}
.overview-row:last-child {
  margin-bottom: 0;
}
.overview-row h3 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin: 0 0 4px;
  font-weight: 600;
}
.overview-row p {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  color: var(--text);
}

.state-delta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
@media (max-width: 700px) {
  .state-delta {
    grid-template-columns: 1fr;
  }
}
.state-delta .lane {
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
}
.state-delta .lane h3 {
  margin: 0 0 10px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
.state-delta .lane.today {
  background: #fafafa;
}
.state-delta .lane.today h3 {
  color: var(--muted);
}
.state-delta .lane.after {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.state-delta .lane.after h3 {
  color: var(--ok);
}
.state-delta .lane.why {
  background: var(--accent-soft);
  border-color: #bfdbfe;
}
.state-delta .lane.why h3 {
  color: var(--accent);
}
.state-delta .lane ul {
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
}
.state-delta .lane li {
  margin: 5px 0;
}
```

When to skip the plain-English opening: the artifact is technical-only (PR review, code-level explainer for engineers, debugging report). Don't pad those with translations the reader doesn't need.

### Brownfield treatment (setup, migration, and configuration guides)

Most "how to set this up" docs are read by people who _already have some of it_. Writing them as if the reader has nothing is the most common failure mode of opinionated playbooks: every paragraph triggers "I already did that" friction, and the reader bails. Brownfield-by-default rules:

#### 1. State-delta block: cover the range of starting states

The "Today" lane must not be a worst-case strawman. Acknowledge that readers arrive at different points along the journey. Rewrite each bullet as a _spectrum_, not a single bad state.

```html
<div class="lane today">
  <h3>Where you might be today</h3>
  <ul>
    <li>
      Anywhere from <em>no config at all</em> to
      <em>config files in five places that disagree</em>.
    </li>
    <li>
      Manual setup somewhere between <em>a fresh day's work</em> and
      <em>30 minutes of muscle memory</em>.
    </li>
    <li>
      Hooks either <em>not configured</em> or
      <em>firing twice and you're not sure why</em>.
    </li>
  </ul>
</div>
```

The "After" lane stays a single target state (that's the point). The "Why it matters" lane stays universal.

#### 2. Audit checklist at the top of the report

Required for setup/migration/config guides. The reader self-assesses against the recommendations before reading the sections. Items they tick get dimmed throughout the rest of the artifact. Persist with `localStorage` so progress survives reload.

```html
<aside class="audit no-print" id="audit">
  <h3>Quick audit — what do you already have?</h3>
  <p class="muted">
    Tick what's already true on your system. Sections covering things you've
    done will dim. Your selections persist locally.
  </p>
  <ul class="audit-list">
    <li>
      <label
        ><input type="checkbox" data-have="agents-md" /> Single
        <code>AGENTS.md</code> at user scope</label
      >
    </li>
    <li>
      <label
        ><input type="checkbox" data-have="claude-symlink" />
        <code>CLAUDE.md</code> is a symlink to <code>AGENTS.md</code></label
      >
    </li>
    <li>
      <label
        ><input type="checkbox" data-have="dotfiles" /> Config lives in a
        versioned dotfiles repo</label
      >
    </li>
    <li>
      <label
        ><input type="checkbox" data-have="stow" /> Symlinks managed by Stow (or
        equivalent)</label
      >
    </li>
    <li>
      <label
        ><input type="checkbox" data-have="1password" /> Secrets via 1Password
        CLI</label
      >
    </li>
    <li>
      <label
        ><input type="checkbox" data-have="three-mcps" /> Context7 + Playwright
        + tracker MCPs at user scope</label
      >
    </li>
  </ul>
  <div class="audit-summary">
    <span id="audit-count">0</span> of <span id="audit-total">6</span> done
  </div>
</aside>
```

Wire each section / step to a `data-need="agents-md claude-symlink"` attribute listing which audit items it covers. When all of those items are ticked, the section gets a "✓ already have this" badge and dims to 0.5 opacity.

```html
<section class="section" id="s1" data-need="agents-md claude-symlink">
  <h2><span class="num">1.</span> AGENTS.md and CLAUDE.md coexistence</h2>
  <!-- … -->
</section>
```

```javascript
const AUDIT_KEY = "html-artifact-audit-v1";
const saved = JSON.parse(localStorage.getItem(AUDIT_KEY) || "{}");

function applyAudit() {
  const have = new Set(
    Object.entries(saved)
      .filter(([, v]) => v)
      .map(([k]) => k),
  );
  document.getElementById("audit-count").textContent = have.size;
  document.querySelectorAll("[data-need]").forEach((el) => {
    const need = el.dataset.need.split(/\s+/);
    const allMet = need.every((n) => have.has(n));
    el.classList.toggle("already-have", allMet);
  });
  document.querySelectorAll(".audit input[type=checkbox]").forEach((cb) => {
    cb.checked = !!saved[cb.dataset.have];
  });
}

document.querySelectorAll(".audit input[type=checkbox]").forEach((cb) => {
  cb.addEventListener("change", () => {
    saved[cb.dataset.have] = cb.checked;
    localStorage.setItem(AUDIT_KEY, JSON.stringify(saved));
    applyAudit();
  });
});

applyAudit();
```

```css
.audit {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 24px;
}
.audit h3 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin: 0 0 4px;
  font-weight: 600;
}
.audit p.muted {
  color: var(--muted);
  font-size: 13px;
  margin: 0 0 12px;
}
.audit-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
  columns: 2;
  column-gap: 24px;
}
@media (max-width: 700px) {
  .audit-list {
    columns: 1;
  }
}
.audit-list li {
  break-inside: avoid;
  margin: 6px 0;
  font-size: 14px;
}
.audit-list label {
  display: flex;
  gap: 8px;
  align-items: baseline;
  cursor: pointer;
}
.audit-summary {
  font-size: 12px;
  color: var(--muted);
  padding-top: 8px;
  border-top: 1px solid var(--border);
}
.already-have {
  opacity: 0.55;
}
.already-have::after {
  content: " ✓ already have this";
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  font-weight: 600;
  vertical-align: middle;
}
.already-have h2::after {
  /* badge on the section heading directly */
}
```

#### 3. Bootstrap sequence: skip-if-done checkboxes

The bootstrap section (multi-step shell sequence at the bottom of a setup guide) needs per-step checkboxes that survive reload. Same `localStorage` mechanism. Checked steps dim and their command blocks collapse to a one-line "✓ done" summary.

```html
<div class="bootstrap-step" data-step="brew-install">
  <label class="step-check no-print"><input type="checkbox" /> done</label>
  <div class="n">1</div>
  <div class="body">
    <h3>Core tools</h3>
    <pre><code>brew install stow gh git op node jq fd ripgrep</code></pre>
  </div>
</div>
```

```css
.bootstrap-step.done {
  opacity: 0.5;
}
.bootstrap-step.done pre,
.bootstrap-step.done h3 {
  display: none;
}
.bootstrap-step.done .body::before {
  content: "✓ done";
  color: var(--ok);
  font-weight: 600;
  font-size: 13px;
}
.step-check {
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 12px;
  color: var(--muted);
}
.bootstrap-step {
  position: relative;
}
```

#### 4. Mode toggle: green machine vs brownfield

At the top of the artifact, give the reader an explicit framing toggle. Default to brownfield.

```html
<div class="chips no-print" id="setup-mode">
  <span style="color: var(--muted); font-size: 13px;">Reading as:</span>
  <button class="chip active" data-mode="brown">
    I have some of this already
  </button>
  <button class="chip" data-mode="green">Green machine, day zero</button>
</div>
```

In `green` mode: hide the audit card and any "already have this" indicators; show every bootstrap step in full. In `brown` mode: show the audit, dim completed sections, collapse done steps.

Implementation is straightforward: toggle a `data-setup-mode="green|brown"` attribute on `<body>` and gate CSS rules on `body[data-setup-mode="brown"] .audit { display: block; }` etc.

#### Skip brownfield treatment when:

- The artifact is a one-shot incident write-up or a code review — no future "setup" surface for the reader to audit against.
- The reader is explicitly the same person who _wrote_ the doc, and you know their starting state.
- The artifact's value is in the _recommendation_, not in the migration path. (A "here's what good looks like" reference doesn't need an audit.)

### Opinion block (for opinionated guides and playbooks)

Every section of an opinionated guide repeats the same 5-part shape. Bake it in.

```html
<section class="section">
  <h2><span class="num">3.</span> Filesystem layout</h2>

  <div class="recco">
    <strong>Recommendation:</strong> One sentence, imperative mood. The thing to
    do.
  </div>

  <details>
    <summary>Why</summary>
    <p>
      The mechanism. Cite the constraint that makes the recommendation correct.
    </p>
  </details>

  <h3>Files &amp; commands</h3>
  <pre><code>concrete code or path</code></pre>

  <div class="grid3">
    <div class="callout tradeoff">
      <h4>Trade-off</h4>
      What you pay for picking this.
    </div>
    <div class="callout mistake">
      <h4>Common mistake</h4>
      The subtle wrong turn that breaks it.
    </div>
    <div class="callout runnerup">
      <h4>Runner-up</h4>
      The second-best option and when it wins.
    </div>
  </div>
</section>
```

CSS for the opinion block (add to `<style>`):

```css
.recco {
  background: #ecfdf5;
  border-left: 3px solid var(--ok);
  padding: 12px 16px;
  border-radius: 8px;
  margin: 12px 0 16px;
}
.recco strong {
  color: #065f46;
}
.grid3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 700px) {
  .grid3 {
    grid-template-columns: 1fr;
  }
}
.callout {
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
}
.callout h4 {
  margin: 0 0 4px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.callout.tradeoff {
  background: #fffbeb;
  border: 1px solid #fde68a;
}
.callout.tradeoff h4 {
  color: #92400e;
}
.callout.mistake {
  background: #fef2f2;
  border: 1px solid #fecaca;
}
.callout.mistake h4 {
  color: #991b1b;
}
.callout.runnerup {
  background: #f1f5f9;
  border: 1px solid var(--border);
}
.callout.runnerup h4 {
  color: var(--muted);
}
```

### Markdown export limitation

A full synthesized report-to-markdown round-trip is not trivial — preserving section structure, callouts, code blocks, and diagrams in a clean `.md` is its own project. Three options, in priority order:

1. **Verbatim source pass-through** — _default when the source is a markdown file._ Embed the entire source markdown and label the button "Copy source Markdown". Round-trip is exact because nothing was synthesized. Use the base64 pattern below.
2. **Summary export** — when the source isn't markdown (synthesized from code, logs, or conversation). Embed the TL;DR or executive summary only. Label the button "Copy TL;DR" or "Copy summary" so the user knows what they're getting.
3. **Section-by-section** — when readers will want to extract individual sections (e.g., paste one decision into a Linear comment). Add per-section "Copy" buttons that emit just that section's prose + code, skipping diagrams and callouts.

Pick one, name the button accurately, don't pretend a synthesized full-doc export exists.

#### Embedding markdown via base64 (canonical pattern)

`<script type="text/markdown">…</script>` looks elegant but in environments with a `Write` formatter hook (Prettier, dprint, custom hooks) the raw markdown gets reformatted at write time — indentation changes, line wraps insert, and your byte-exact round-trip breaks. Base64-encode the source and decode at click time. This is now the canonical inline-source pattern.

```html
<script>
  // SOURCE_MD_B64 is the base64 of the source markdown file's bytes.
  // Generate at artifact-write time, never edit by hand.
  const SOURCE_MD_B64 = "IyBNeSBkb2N1bWVudC4uLg==";

  function getSourceMarkdown() {
    const bytes = Uint8Array.from(atob(SOURCE_MD_B64), (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  }

  document.getElementById("copy-md").addEventListener("click", (e) => {
    copyText(getSourceMarkdown(), e.target);
  });
</script>
```

To generate `SOURCE_MD_B64` at artifact-write time from the source file:

```bash
base64 -i /path/to/source.md  # macOS
base64 /path/to/source.md     # Linux
```

Embed the resulting one-line string as the constant. Verify the round-trip: decode in browser console, compare byte length to source file. If they match, the export is exact.

The `<script type="text/markdown">` pattern is acceptable **only** when you control the environment and no formatter touches the output file.

Keep paragraphs short. Use ASCII diagrams (see Diagrams section) for hierarchy and SVG for flow/state. No stock photography.

## Archetype 5 — Custom editor

For: triage UI, config editors, prompt tuners, dataset curation, anything where the user manipulates structured data and exports the result.

Pattern: two-column layout. Left: editable inputs (textareas, drag-and-drop lists, sliders). Right: live preview rendered from the left. Bottom: export bar.

```html
<div class="editor-grid">
  <section class="card">
    <h3>Input</h3>
    <!-- 16px font, not 13px: a sub-16px textarea triggers iOS focus-zoom. -->
    <textarea
      id="src"
      rows="14"
      style="width:100%; font: 16px/1.5 'SF Mono', monospace;"
    ></textarea>
  </section>
  <section class="card">
    <h3>Preview</h3>
    <div id="preview"></div>
  </section>
</div>
<script>
  const src = document.getElementById("src");
  const preview = document.getElementById("preview");
  src.addEventListener("input", () => {
    preview.textContent = src.value;
  });
</script>
```

```css
.editor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 700px) {
  /* input stacks above preview on phones */
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
```

For sortable lists (triage): use `draggable="true"` + `dragstart`/`dragover`/`drop` handlers, store order in a JS array, export on demand. No external sortable lib.

## Archetype 6 — Mockup gallery

For: design variants the user will review and pick from. Often produces input for archetype 1 (comparison grid).

Each variant in its own labeled card. Include a parameter knob row at the top (sliders for spacing, font size, border radius) that mutates a CSS custom property applied to every card.

```html
<div class="toolbar no-print">
  <label
    >Radius <input type="range" id="r" min="0" max="24" value="12"
  /></label>
  <label
    >Density <input type="range" id="d" min="8" max="32" value="20"
  /></label>
</div>
<div
  style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;"
>
  <article class="card" style="border-radius: var(--r); padding: var(--d);">
    ...variant A...
  </article>
  <article class="card" style="border-radius: var(--r); padding: var(--d);">
    ...variant B...
  </article>
</div>
<script>
  const root = document.documentElement.style;
  ["r", "d"].forEach((id) => {
    const el = document.getElementById(id);
    const apply = () => root.setProperty("--" + id, el.value + "px");
    el.addEventListener("input", apply);
    apply();
  });
</script>
```

---

## Interactive scenario exploration

If the artifact has more than one audience, scenario, or starting state, build the branching in — don't write parallel sections and tell the reader to skip ahead. Five patterns, in escalating complexity.

### 1. Filter chips (single or multi-select)

Use when sections of the artifact apply to different platforms, roles, or stages.

```html
<div class="chips no-print" id="platform-chips">
  <button class="chip active" data-tag="all">All</button>
  <button class="chip" data-tag="macos">macOS</button>
  <button class="chip" data-tag="linux">Linux</button>
  <button class="chip" data-tag="wsl">WSL</button>
</div>

<!-- Tag relevant blocks: -->
<pre data-platform="macos"><code>brew install stow</code></pre>
<pre data-platform="linux"><code>sudo apt install stow</code></pre>
<pre
  data-platform="wsl"
><code>sudo apt install stow  # inside WSL2 Ubuntu</code></pre>

<script>
  const chips = document.querySelectorAll("#platform-chips .chip");
  chips.forEach((c) =>
    c.addEventListener("click", () => {
      chips.forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      const tag = c.dataset.tag;
      document.querySelectorAll("[data-platform]").forEach((el) => {
        el.style.display =
          tag === "all" || el.dataset.platform === tag ? "" : "none";
      });
    }),
  );
</script>
```

```css
.chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 12px 0;
}
.chip {
  font: inherit;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  font-size: 13px;
}
.chip.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
```

### 2. Persona toggle (mutates highlighted recommendations)

Use when the same artifact serves multiple personas (solo dev / team lead / oncall).

```html
<div class="chips no-print">
  <span style="color: var(--muted); font-size: 13px;">Reading as:</span>
  <button class="chip active" data-persona="solo">Solo dev</button>
  <button class="chip" data-persona="team">Team monorepo</button>
  <button class="chip" data-persona="oncall">Oncall</button>
</div>

<!-- Each recco can advertise which personas it most applies to: -->
<div class="recco" data-personas="solo team">
  <strong>Recommendation:</strong> Single dotfiles repo, stow over $HOME.
</div>
<div class="recco" data-personas="team">
  <strong>Recommendation:</strong> Commit
  <code>.claude/settings.json</code> with team-wide permission allowlist.
</div>
```

```javascript
// Dim — don't hide — so peripheral context survives the toggle.
const chips = document.querySelectorAll(".chips [data-persona]");
chips.forEach((c) =>
  c.addEventListener("click", () => {
    chips.forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    const p = c.dataset.persona;
    document.querySelectorAll("[data-personas]").forEach((el) => {
      const matches = el.dataset.personas.split(/\s+/).includes(p);
      el.classList.toggle("dim", !matches);
    });
  }),
);
```

```css
.dim {
  opacity: 0.35;
  transition: opacity 0.15s;
}
```

`data-personas` may be applied at the recco level (precise — dims a single recommendation inside a section that's otherwise fully relevant) **or** at the section level (coarser but often more readable — when the entire section is persona-specific, dimming per-recco produces visual noise). Default to section level; drop down to recco level only when one section serves multiple personas with different reccos.

### 3. Decision-tree reveals

Use for "where does this asset live?" / "which archetype do I pick?" / triage flows. Click to expand the next layer.

```html
<div class="tree" role="tree">
  <button class="tree-q" aria-expanded="false" data-target="t1">
    Is the asset useful in more than one repo?
  </button>
  <div class="tree-a" id="t1" hidden>
    <button class="tree-q" aria-expanded="false" data-target="t2">
      Yes — does it need a teammate to use it?
    </button>
    <div class="tree-a" id="t2" hidden>
      <p>Yes → ship as a plugin in its own repo.</p>
      <p>No → user scope, in <code>~/.claude/skills/</code>.</p>
    </div>
    <button class="tree-q" aria-expanded="false" data-target="t3">
      No — is it repo-specific config or code?
    </button>
    <div class="tree-a" id="t3" hidden>
      <p>Project scope: <code>./.claude/</code>.</p>
    </div>
  </div>
</div>

<script>
  document.querySelectorAll(".tree-q").forEach((q) =>
    q.addEventListener("click", () => {
      const t = document.getElementById(q.dataset.target);
      const open = t.hidden;
      t.hidden = !open;
      q.setAttribute("aria-expanded", String(open));
    }),
  );
</script>
```

```css
.tree {
  margin: 16px 0;
}
.tree-q {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  margin: 4px 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
}
.tree-q[aria-expanded="true"] {
  border-color: var(--accent);
  color: var(--accent);
}
.tree-q[aria-expanded="true"]::before {
  content: "▾ ";
}
.tree-q[aria-expanded="false"]::before {
  content: "▸ ";
}
.tree-a {
  padding: 4px 0 4px 28px;
  border-left: 2px solid var(--accent-soft);
  margin: 4px 0 12px;
}
```

### 4. Diff-from-default mode

For setup guides and config docs read by users who already have most of the setup. A toggle that shows only the steps the reader hasn't done yet.

```html
<label
  class="no-print"
  style="display: flex; gap: 8px; align-items: center; margin: 12px 0;"
>
  <input type="checkbox" id="diff-only" />
  <span>Show only deltas from default config</span>
</label>

<!-- Tag default-equivalent steps: -->
<div class="step" data-default="true">
  Step that most readers will already have.
</div>
<div class="step" data-default="false">Step that's specific to this setup.</div>

<script>
  document.getElementById("diff-only").addEventListener("change", (e) => {
    document.querySelectorAll(".step[data-default='true']").forEach((el) => {
      el.style.display = e.target.checked ? "none" : "";
    });
  });
</script>
```

### 5. Parameter knobs (sliders + live previews)

Already covered in Archetype 6 (Mockup gallery). Cross-reference it when a Report or Plan benefits from "what happens if I change X" exploration — e.g., a rate-limiter explainer with sliders for `requests/sec` and `burst size` that updates the SVG diagram in real time.

### When NOT to add interactivity

- The reader will print and read on paper. Print kills interactivity.
- The artifact has one audience and one scenario. Toggles for nothing are noise.
- The interactivity hides important content by default and the reader will miss it. Default to "everything visible" with toggles that narrow, not toggles that reveal.

---

## Diagrams: ASCII first, SVG second

Reach for ASCII before SVG. Most file trees, sequence flows, and small state machines look better as `<pre>` blocks — they're readable in plain text, copy-pasteable into a chat, render identically across browsers, and force you to keep the structure simple.

### When ASCII wins

- File trees, directory layouts, module hierarchies.
- Linear flows with ≤8 nodes and no branching.
- Anything the reader might paste back into Claude or a chat.
- Anything you'd lose nothing by rendering in monospace.

### When to escalate to SVG

- Color encodes meaning (severity, type, lifecycle stage).
- Parallel branches with crossings or merges.
- More than ~15 nodes.
- You need curved connectors, anchored labels, or non-monospace text inside a node.
- The diagram has interactive parts (hover tooltips, click to highlight a path).

### ASCII tree

```html
<pre><code>dotfiles/
├── .claude/                    # thin project scope
│   └── agents -> ../claude/agents
├── claude/                     # real assets, versioned
│   ├── AGENTS.md
│   ├── CLAUDE.md -> AGENTS.md
│   ├── agents/
│   ├── hooks/
│   ├── skills/
│   └── settings.json
└── docs/</code></pre>
```

### ASCII flow (left to right)

```html
<pre><code>┌──────────┐    ┌──────────┐    ┌──────────┐
│  client  │ ── │  worker  │ ── │  store   │
└──────────┘    └──────────┘    └──────────┘
       │              │              │
       └─── retry ────┘              │
                                     │
                              ┌──────▼───────┐
                              │  audit log   │
                              └──────────────┘</code></pre>
```

### ASCII state machine

```html
<pre><code>  ┌────────┐  start    ┌──────────┐  ok    ┌────────┐
  │  idle  │ ────────► │  running │ ─────► │  done  │
  └────────┘           └──────────┘        └────────┘
                            │
                            │ err
                            ▼
                       ┌──────────┐
                       │  failed  │
                       └──────────┘</code></pre>
```

Box-drawing chars you'll reach for: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ◄ ► ▲ ▼ ►`. Most terminals and browsers render them at the same width as ASCII; double-check in the actual viewport before shipping.

### SVG quick-ref (when ASCII isn't enough)

Always set `viewBox`, `role="img"`, and an `aria-label`. Use palette tokens via `var(--name)`. Arrows via one `<defs><marker>` at the top of the SVG.

```html
<svg class="diagram" viewBox="0 0 600 200" role="img" aria-label="…">
  <defs>
    <marker
      id="arr"
      viewBox="0 0 10 10"
      refX="10"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
    </marker>
  </defs>
  <rect
    x="20"
    y="40"
    width="140"
    height="80"
    rx="10"
    fill="var(--accent-soft)"
    stroke="var(--accent)"
    stroke-width="1.5"
  />
  <text x="90" y="86" text-anchor="middle" font-size="13" font-weight="600">
    Client
  </text>
  <path
    d="M 160 80 L 240 80"
    stroke="var(--muted)"
    stroke-width="1.5"
    marker-end="url(#arr)"
  />
</svg>
```

```css
svg.diagram {
  width: 100%;
  max-width: 720px;
  height: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
}
```

### SVG sequence diagram pattern

For request flows with N actors and ordered messages. Vertical lifelines, horizontal arrows.

```html
<svg
  class="diagram"
  viewBox="0 0 600 220"
  role="img"
  aria-label="OAuth callback flow"
>
  <!-- lifelines -->
  <g stroke="var(--border)" stroke-dasharray="3 4">
    <line x1="100" y1="50" x2="100" y2="200" />
    <line x1="300" y1="50" x2="300" y2="200" />
    <line x1="500" y1="50" x2="500" y2="200" />
  </g>
  <!-- actor headers -->
  <g font-size="13" text-anchor="middle">
    <text x="100" y="36">Browser</text>
    <text x="300" y="36">App</text>
    <text x="500" y="36">IdP</text>
  </g>
  <!-- arrows -->
  <g
    stroke="var(--accent)"
    fill="var(--accent)"
    font-size="12"
    stroke-width="1.5"
  >
    <path d="M 100 80 L 296 80" marker-end="url(#arr)" />
    <text x="200" y="74" text-anchor="middle" fill="var(--text)" stroke="none">
      GET /login
    </text>
    <path d="M 300 110 L 496 110" marker-end="url(#arr)" />
    <text x="400" y="104" text-anchor="middle" fill="var(--text)" stroke="none">
      redirect to IdP
    </text>
    <path d="M 500 150 L 304 150" marker-end="url(#arr)" />
    <text x="400" y="144" text-anchor="middle" fill="var(--text)" stroke="none">
      authcode
    </text>
    <path d="M 300 180 L 104 180" marker-end="url(#arr)" />
    <text x="200" y="174" text-anchor="middle" fill="var(--text)" stroke="none">
      session cookie
    </text>
  </g>
</svg>
```

### Diagram budget

Keep any single diagram under 12 nodes. If you need more, either:

1. Split into two diagrams with a shared key.
2. Drop to ASCII and accept lower visual density.
3. Promote the diagram to its own artifact and link to it.

## Mobile responsiveness (required)

Artifacts get read on phones — in Slack, in email, over AirDrop. The base template bakes in the safe defaults; this section is the contract and the gotchas the defaults don't cover.

### The 375px contract

At a 375px-wide viewport (iPhone SE, the narrowest target), every artifact must:

- Have **no horizontal page scroll.** The page never widens past the viewport.
- **Scroll wide content inside its own container,** not the page. Tables, code blocks, and diagrams overflow their box, never the body.
- Trigger **no focus-zoom.** Tapping an input never zooms the page (16px-minimum input font, baked into the base template).
- Offer **tap targets ≥ 40px.** Buttons, chips, and controls are tappable, not pixel-hunts. (The base template sets `min-height: 40px` on these under 600px.)

### iOS Safari gotchas (distilled from zz-ios-proof-frontend)

The base template already handles input-zoom (16px), `-webkit-text-size-adjust`, and the `.table-scroll` wrapper. Beyond those:

- **Full-height layouts: `100dvh`, never `100vh`.** `100vh` on iOS includes the address bar, so content hides behind the browser chrome. Use `min-height: 100dvh` (dynamic) for a full-screen artifact; `100svh` when you need a height that never shifts. Most read-and-share artifacts flow with content and need neither — only reach for these on a genuinely full-screen layout.
- **Content reaching the screen edge: pad with `env(safe-area-inset-*)`.** The notch and home indicator overlap edge-pinned content. This needs `viewport-fit=cover` on the viewport meta to take effect — the base template's meta omits it, so add `viewport-fit=cover` to the meta if and only if you pin content to a screen edge. Otherwise leave the meta as-is (pinch-zoom stays enabled — don't add `maximum-scale=1`).
- **Scroll containers: add `overscroll-behavior: contain`** so a scroll inside a panel doesn't rubber-band the whole page.
- **Avoid `position: fixed`** for bottom-pinned bars on iOS — it jumps when the keyboard opens. Artifacts rarely need it; prefer normal document flow or a flex column. If you truly need a sticky composer, that's app territory, not an artifact (see zz-ios-proof-frontend Rule 12).
- **Data tables collapse to compact cards; narrow tables scroll.** Wrap every `<table>` in `.table-scroll` (base template) — never let one set a fixed width. On desktop it scrolls inside its box; below 720px the base template reflows a data table into compact cards (see _Responsive data tables_ below). A 2–3 column table is fine to leave scrolling; an 8-column one must become cards.

### Copy-paste collapse snippet

The base template handles body padding and tap-target sizing under 600px. For an artifact's own multi-column layouts, collapse them at 700px (matching the shared scaffolds below) and make controls full-width:

```css
@media (max-width: 700px) {
  /* multi-column grids → single column */
  .my-two-col,
  .my-three-col {
    grid-template-columns: 1fr;
  }
  /* tighten generous desktop padding */
  .card {
    padding: 16px;
  }
  /* controls span the row so they're easy to hit */
  .toolbar button,
  .toolbar select {
    flex: 1 1 auto;
  }
}
```

Wrap any table so it scrolls inside its box instead of widening the page:

```html
<div class="table-scroll">
  <table>
    <!-- … -->
  </table>
</div>
```

The shared scaffolds already collapse: `.grid3` / `.state-delta` (700px), comparison-grid and mockup-gallery (auto-fit, no query needed), `.audit-list` (columns → 1 at 700px), `.layout` sticky-TOC (900px), `.review-row` and `.editor-grid` (700px). Reuse them rather than re-rolling a breakpoint.

### Responsive data tables (cards, not sideways scroll) — the canonical pattern

A multi-column data table that merely scrolls sideways on a phone is a poor UX — a tiny grid you drag around. The base template's default (CSS `@media (max-width: 720px)` block + the `<script>` column-tagger) **collapses any `.table-scroll` table into compact cards** below 720px, with **zero per-cell authoring effort**: the JS reads each `<th>` and sets `data-label` on every cell at runtime, and tags the headline / id columns.

What you get, automatically:

- **Compact cards, not one-field-per-line.** The first proven attempt stacked every cell on its own line — an 8-column row became a ~16-line card → endless scroll. The default avoids that: the **primary text column is the card headline** (bold, no label), short fields are a tight `label | value` grid (one line each), and an **id/rank column is a small accent line**. Columns are classified generically at runtime from the `<th>` text.
- **Tune the classifier to your headers.** The `<script>` keyword lists decide which column is the headline vs. id. Defaults: `HEAD = ["decision","item","problem","risk","question","action","opportunity","candidate","finding","name"]`, `IDC = ["#","id","rank"]`. Add your table's header word if its headline isn't picked up. (Match is exact, lowercased.)

**Collapsible sections for long tables.** A report with many long tables still scrolls forever even as cards. Wrap each long section in `<details>` **closed by default on phones**, with a count in the summary so the reader scrolls a short list of headers + the TOC, not every row:

```html
<details class="section" open>
  <summary>
    <h2>Backlog <span class="count">61 items</span></h2>
  </summary>
  <div class="table-scroll">
    <table>
      …
    </table>
  </div>
</details>
```

```css
details.section > summary {
  cursor: pointer;
  list-style: none;
}
details.section > summary h2 {
  display: inline;
}
.count {
  font: 600 12px / 1 var(--sans);
  color: var(--muted);
}
@media (max-width: 720px) {
  details.section[open] {
    /* leave author's choice on desktop; default-close on phones via JS below */
  }
}
```

```js
// On phones, collapse every section by default so the reader sees a short
// stack of headers, not 600 rows. Desktop keeps them open.
if (window.matchMedia("(max-width: 720px)").matches) {
  document
    .querySelectorAll("details.section")
    .forEach((d) => d.removeAttribute("open"));
}
```

For a report rendered from markdown (where you have `<h2>` headings, not authored `<details>`), the equivalent is to wrap each `<h2>`'s following siblings in a `.secbody` div at runtime and toggle on `<h2>` click — same effect, no markup change. The live reference implementation is the `mirror-product-synthesis` artifact (its `<script>` `sectoggle` block) and the [theme/pattern preview](https://bwai-share.vercel.app/mirror-theme-preview/).

## When to split into multiple artifacts

Generate a second file rather than a giant single one when:

- Total HTML exceeds ~600 lines.
- The artifact mixes archetypes (e.g., a plan that also wants to be an editor).
- One section is independently shareable (e.g., the comparison grid will be reused alone).

Link the files together with relative `<a>` tags in a small index at the top.
