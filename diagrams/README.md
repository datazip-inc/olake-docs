# OLake architecture diagrams

Editable source for the figures in the [OLake architecture deep-dive](../blog/2026-07-22-deep-dive-into-olake-architecture.mdx), built on one design language so every diagram uses the same shapes, colours, and arrow grammar.

## Files

| Path | What it is |
| --- | --- |
| `olake-architecture.drawio` | All 12 diagrams as pages of one draw.io file. **Page 00 is the legend** — read it before editing anything else. |
| `olake-shape-library.xml` | draw.io shape library: every reusable component, plus the vendor marks, for drag-and-drop. |
| `previews/pNN.svg` | Rendered preview of each page (same geometry), handy for reviewing in a browser or a PR. |
| `tools/gen.py` | The generator that produces all three of the above. Use it for systematic changes. |
| `tools/build_icons.py`, `tools/icons.json` | The vendor marks, extracted from [simple-icons](https://simpleicons.org) (CC0) and [devicon](https://devicon.dev), plus hand-drawn marks for Db2, S3, Iceberg, and the JVM. |

## Pages

| | |
| --- | --- |
| `00` | **Design language** — palette, components, interface notation, edges, rules |
| `01` | Pipeline overview: sources → sync engine → writers → destinations |
| `02` | Eight drivers, one `DriverInterface` (UML component + interface notation) |
| `03` | Chunked full loads: a real table sliced into ctid ranges, worker pool, `state.json` |
| `04` | CDC — sequential: one ordered log, one reader (Postgres, MySQL) |
| `05` | CDC — concurrent: a change feed per stream (MongoDB, SQL Server) |
| `06` | CDC — parallel: Kafka partitions fan out, topics converge |
| `07` | Full load → CDC handoff, as a numbered timeline |
| `08` | **Worked example**: row 2 (Bob) arrives via both paths and lands once |
| `09` | **Worked example**: what a record carries — metadata columns and the five op types |
| `10` | Exactly-once: the table is the ledger (`olake_2pc`) |
| `11` | The write path: Go builds Parquet, the JVM sidecar commits |

## Editing

**One-off tweaks — edit the `.drawio` directly.** Pick whichever surface you prefer; all three read and write the same file.

*In VS Code or Cursor (best for keeping it in git):*

```sh
code --install-extension hediet.vscode-drawio     # once; Cursor: same flag, or search "Draw.io Integration" in Extensions
code diagrams/olake-architecture.drawio           # opens the visual editor, not XML
```

Pages are tabs along the bottom of the editor. Save with ⌘S and the diff shows up in `git status` like any other file. To see the raw XML instead, right-click the file → *Open With…* → *Text Editor*.

*In the browser:* go to [app.diagrams.net](https://app.diagrams.net) → **File → Open From → Device** → pick `diagrams/olake-architecture.drawio`. Edit, then **File → Save As → Device** and overwrite the file in the repo. (Nothing is uploaded to a server — diagrams.net edits locally in the tab.)

*In the desktop app:* `brew install --cask drawio`, then open the file.

Then, in any of them:

1. Load the components: **File → Open Library From → Device →** `olake-shape-library.xml`. All 40 entries — components, glyphs, vendor marks — appear in the left panel for drag-and-drop.
2. To propagate a style: right-click a styled shape → **Copy Style**, select the targets → **Paste Style**.
3. Page 00 is the legend; keep new shapes consistent with it.

**Systematic changes — edit `tools/gen.py` and regenerate.** Every component is a Python method that emits draw.io XML and preview SVG together, so a change to `component()` or the `HUE` table restyles all twelve pages at once:

```sh
cd diagrams/tools && python3 gen.py       # rewrites the .drawio, the library, and previews/
```

`gen.py` needs nothing but Python 3 and the checked-in `icons.json`. Re-running `build_icons.py` (to add a vendor mark) additionally needs `npm install simple-icons devicon` in that directory.

**Caution:** regenerating overwrites hand edits made in draw.io. Either keep changes in `gen.py`, or stop using the generator once you start editing by hand.

## Exporting for the blog

1. Select the page → **File → Export as → PNG**.
2. Zoom **200 %**, border width `0`, background **white** (not transparent — the blog renders on light and dark themes), and uncheck "Include a copy of my diagram".
3. Convert to webp to match the existing assets: `cwebp -q 82 page.png -o olake-chunking-pipeline.webp`, then drop it in `static/img/blog/2026/8/`.

## The design language (page 00 has the full legend)

**Colour is semantic, never decorative.** Blue `#193AE6` = OLake compute · slate `#475A70` = external systems · green `#059669` = durable/committed · amber `#D97706` = state and bookkeeping · rose `#DC2626` = failure and retry. Each is a 2 px stroke over a light tint of the same hue; zones get a solid colour title tab.

**One meaning per shape**, applied consistently:

| Shape | Means |
| --- | --- |
| **Cylinder** (+ vendor mark, + the streams it holds) | any *system that stores data*: source database, Kafka, catalog |
| **Bucket** | object storage |
| **Table card** (grid glyph + name) | a *table* at the destination — never a bare rectangle |
| **UML component** (component marker in the top-right corner) | anything OLake runs: driver, reader, writer, engine stage |
| **Interface box** (`«interface»`, `I` badge, `method()` lines) | a Go interface; a ball means *implements*, a socket *uses* |
| **Segmented tape** | an ordered change log or partition, with an amber pin at a saved position |
| **Folded note** | a file; stacked = many. A `codenote` shows what is actually inside it |
| **Data table** | a real table, always with real rows |
| **Chip** / **small chip** | a record in motion / a chunk (outline pending, blue in flight, green committed, rose retrying) |

**Glyphs, not new icons.** `GLYPHS` in `gen.py` holds the line-icon set — classify, chunks, types, state, buffer, schema, commit, lock, retry, pin, log, parallel, dial, write, handoff, clock, search, table, file, delete. Every block that needs an icon picks one of these (24 px, drawn in the hue of its block); the whole set is on page 00 and in the shape library. Add to the set rather than drawing a one-off.

**Inline code.** Backticks inside any node or table label render monospace in the accent colour, so a bare op code reads as code: `` `i` only exists in the overlap window ``.

**Edges.** Solid slate = data flow · dashed amber = state and metadata · bold green = atomic commit · red = failure path. Label non-obvious arrows with verbs; two-way arrows only for real request/response pairs. Labels sit *beside* the line — above a horizontal edge, to the right of a vertical one — never on an opaque badge that punches a hole in whatever is behind it.

**Rules.** Real values in every shape (ctid ranges, LSNs, `id 2 · Bob`) — never placeholder boxes. Vendor marks identify a system, but the shape still carries the meaning. Twelve primary nodes per page maximum; split rather than shrink the type. Every page gets a title, a one-sentence caption, and numbered step circles when order matters. No funnels: show selection as fewer things leaving a stage than entered it. A new concept gets its symbol added to page 00 first.

Type is Helvetica throughout: 21 bold page titles, 13 bold node names, 11 slate secondary, 11 mono for code identifiers.

## Where the conventions come from

The language follows published guidance — [C4 notation](https://c4model.com/diagrams/notation) (titles, legends, verb-labelled unidirectional arrows), [draw.io's consistency guide](https://www.drawio.com/docs/best-practice/consistent-diagrams/), [Ilograph's diagram-mistakes series](https://www.ilograph.com/blog/posts/diagram-mistakes/) (name instances, not types; split perspectives), and [Excalidraw's palette formula](https://plus.excalidraw.com/blog/open-colors) (dark stroke, light same-hue fill, ≤ 5 hues).

Domain conventions came from a survey of how the field actually draws these things: [Kafka's log-anatomy figures](https://kafka.apache.org/documentation/) (the log as a cell tape with offset pointers), [Netflix DBLog](https://netflixtechblog.com/dblog-a-generic-change-data-capture-framework-69351fb9099b) (chunked tables with real boundary values, state as a sidecar), [PeerDB](https://blog.peerdb.io/how-can-we-make-pgdump-and-pgrestore-5-times-faster) (table slices labelled with actual ranges), [Debezium's incremental-snapshot post](https://debezium.io/blog/2021/10/07/incremental-snapshots/) (`K2: U` event cells), [Confluent's DLQ post](https://www.confluent.io/blog/kafka-connect-deep-dive-error-handling-dead-letter-queues/) (failure as red fill on the same shapes), and [Fivetran's hybrid deployment diagram](https://fivetran.com/docs/deployment-models/hybrid-deployment) (numbered badges on arrows, dashed for the control plane).
