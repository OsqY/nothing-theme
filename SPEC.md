# Nothing Theme for Zed — Specification

> A Zed editor theme extension that brings the industrial, dot-matrix,
> monochrome design language of **Nothing Technology Limited** to your editor.

Status: **Draft for review** — see the "Open Questions" section at the end.
This document was built from (a) the official Zed theme/extension docs and
theme JSON schema, and (b) an investigation of Nothing's brand and products.

---

## 1. Goals & Non-Goals

### Goals
- Ship a **pure theme extension** (JSON only, no Rust/WASM) for Zed.
- Capture Nothing's design DNA: *subtract don't add*, *structure is ornament*,
  transparency, dot-matrix typography influence, monochrome + signal accents.
- MVP includes a small set of **flagship** themes that map to iconic Nothing/CMF
  products (e.g. Phone (1) glyph, Headphone (1) white, CMF Phone (1) orange).
- Make dev-install trivial (`Install Dev Extension`) and publish-ready for the
  Zed extension registry (PR to `zed-industries/extensions`).

### Non-Goals (MVP)
- No custom Rust/WebAssembly code (themes don't need it).
- No bundling fonts (Zed themes can't ship fonts; we only recommend families in
  the README — fonts are configured in `settings.json`).
- No icon theme, snippets, languages, or MCP server (registry rules require
  themes to live in their own extension).
- Not an official Nothing product; this is a fan-made, community theme. Brand
  names are referenced for inspiration only.

---

## 2. Environment (verified on this machine)

| Item | Value | Relevance |
|------|-------|-----------|
| Zed | `1.7.2` at `~/.local/zed.app`, CLI `~/.local/bin/zed` | Target editor |
| Rust/cargo | `rustc` present, **`cargo` NOT installed** | Irrelevant for pure themes — themes compile no code |
| Node | `v26.0.0` | Only needed if we add a build/preview script later |
| Current Zed theme | light `One Light`, dark `Blade Runner 2049 …` (3rd-party) | Reference; we won't touch user settings |
| Vim mode | enabled | Theme must look good with vim mode UI |

### Install path for development
A pure theme extension installs with **no toolchain**:
1. Open Zed → command palette → `zed: extensions`.
2. Click **Install Dev Extension** → select this repo folder.
3. It appears in the theme selector (`theme selector: toggle`, `Ctrl-K Ctrl-T`).
4. For verbose logs: `zed --foreground`.

> The Zed docs' general statement "install Rust via rustup" applies only to
> extensions that ship Rust code (language/context/debug servers). Theme-only
> extensions need none of it. (Source: Developing Extensions § "Rust and
> WebAssembly".)

---

## 3. Zed Theme Extension — Technical Facts (from official docs)

### Extension repo shape
A theme extension is a **Git repository** with this layout:

```
nothing-theme/
├── extension.toml      # manifest (required)
├── LICENSE             # required by registry (MIT/Apache/BSD/CC-BY/GPL/LGPL/Unlicense/zlib)
├── README.md
├── .gitignore
└── themes/
    ├── nothing-glyph.json       # one theme *family* file can hold many themes
    └── ...
```

### `extension.toml` manifest (required keys)
```toml
id = "nothing-theme"                 # unique, suffix -theme; must NOT contain "zed"/"extension"
name = "Nothing"
version = "0.1.0"
schema_version = 1
authors = ["osqy <oscarjosehpc@gmail.com>"]
description = "Industrial monochrome, dot-matrix-inspired themes from Nothing's design language."
repository = "https://github.com/<user>/nothing-theme"
```

### Theme JSON schema (`https://zed.dev/schema/themes/v0.2.0.json`)
A theme file is a **Theme Family** object:
- `name` (family name), `author`, `themes[]`
- Each theme: `name`, `appearance` (`"light"`|`"dark"`), `style` { ... }

`style` has ~150 optional keys grouped into:
- **Surfaces:** `background`, `background.appearance`
  (`opaque`|`transparent`|`blurred`), `surface.background`, `elevated_surface.background`
- **Window chrome:** `title_bar.*`, `status_bar.background`, `tab_bar.*`, `toolbar.background`, `panel.*`, `pane.*`, `scrollbar.*`
- **Elements:** `element.*`, `ghost_element.*`, `border.*`, `drop_target.background`
- **Text / icons:** `text`, `text.muted/accent/disabled/placeholder`, `icon.*`, `link_text.hover`
- **Editor:** `editor.background`, `editor.foreground`, `editor.gutter.*`, `editor.line_number`, `editor.active_line_number`, `editor.indent_guide*`, `editor.wrap_guide*`, `editor.document_highlight.*`, `search.match_background`
- **Syntax (tree-sitter captures):** `syntax` object with keys like
  `keyword`, `function`, `string`, `string.escape`, `string.regex`,
  `number`, `boolean`, `constant`, `type`, `enum`, `constructor`,
  `comment`, `comment.doc`, `keyword`, `operator`, `punctuation*`,
  `tag`, `attribute`, `property`, `variable`, `variable.special`,
  `emphasis`, `emphasis.strong`, `title`, `link_text`, `link_uri`,
  `diff.plus`, `diff.minus`, etc. Each value = `{color, font_style,
  font_weight}` (all optional).
- **Git/vcs status:** `version_control.*`, `created/deleted/modified/conflict/renamed/ignored/hidden/predictive/unreachable` (+ `.background`/`.border`)
- **Diagnostics:** `error`, `warning`, `info`, `hint`, `success` (+ bg/border)
- **Terminal:** `terminal.background`, `terminal.foreground`, `terminal.bright_foreground`, `terminal.dim_foreground`, and full `terminal.ansi.*` 16-color set (+ dim/bright variants)
- **Multiplayer cursors:** `players[]` = `{cursor, background, selection}` (≤8)
- **Accents:** `accents[]` array of color strings

Reference implementation to mirror: Zed's built-in
`assets/themes/one/one.json` (One Dark + One Light in one family file).

### Publishing (later)
- Fork `zed-industries/extensions`, add this repo as a Git submodule under
  `extensions/nothing-theme`, add an entry to top-level `extensions.toml`,
  run `pnpm sort-extensions`, open PR. Submodule must use an **HTTPS** URL and
  point to a branch (not a detached commit). A LICENSE file at repo root is
  mandatory (CI validates it). ID/name cannot include "zed"/"extension";

### Limitations / caveats
- Themes **cannot change fonts** — only colors, font_style (italic/normal), and
  font_weight. Recommended Nothing fonts (NDot, NType82, Lettera Mono) go in
  the README as a `settings.json` snippet.
- `background.appearance: "blurred"`/`"transparent"` enables macOS-style window
  blur; behavior varies by platform (Linux/Wayland support is spotty) — we
  will ship `opaque` by default and offer a blurred variant as a stretch goal.
- All colors are hex with alpha (`#RRGGBBAA`); `null` falls back to defaults.

---

## 4. Nothing Design Language — Research

### Brand pillars (synthesized from official product pages + third-party analysis)
1. **Subtract, don't add.** Radical restraint; whitespace over decoration.
2. **Structure is ornament.** Internal components and fasteners become the
   visual interest (transparent backs, visible screws on CMF).
3. **Monochrome first.** Black, white, "milk" (warm off-white). Color is a
   *signal*, not decoration.
4. **Dot-matrix typography.** Display type (NDot family) renders glyphs from a
   grid of dots — a nod to 1980s IBM mainframe readouts.
5. **Signal accents.** A single brand red (Nothing) and a single orange (CMF
   sub-brand) are used sparingly for emphasis/notification.

### Typography (official system fonts, per `spike0en/nothing_archive`)
| Font | Role | Source |
|------|------|--------|
| NDot-55 / NDot-57 | Dot-matrix display | Tadiphone system dump |
| NType82 (Headline/Regular) | Primary UI type | Tadiphone system dump |
| Lettera Mono | Monospace / data | Tadiphone system dump |
| Inter | Body text | rsms.me/inter |
| Geist Mono | Website mono | Google Fonts |

> Fonts live in `settings.json` under `buffer_font_family`/`ui_font_family`,
> not in the theme. We will document a recommended pairing (e.g.
> `ui_font_family: "Inter"`, `buffer_font_family: "Lettera Mono"` or a
> dot-matrix display font for headings Zed doesn't theme).

### Product investigation (MVP candidate source products)
| Product | Signature look | Palette anchors | Theme idea |
|---------|----------------|----------------|------------|
| **Phone (1)** | Transparent back, 900+ white LED **Glyph Interface** | near-black, transparent, white glyph, signal red | Dark "Glyph" theme |
| **Headphone (1)** | White, transparent "lentil" ear cups, KEF-tuned | pure white, light grey, black text, red accent | Light "White" theme |
| **Phone (2a) / (3)** | "The eyes"; minimal white/black unibody | white / black, red dot | Light/dark minimal pair |
| **CMF Phone (1)** | Visible screws, replaceable backs; **Orange** vegan leather | black, orange (#~FF6A00), light green | "CMF Orange" theme |
| **Ear (1)** | Transparent stem | clear/grey/translucent | stretch: translucent variant |
| **CMF Watch 3 Pro** | Industrial watch, orange accents | black + orange | stretch variant |

### Proposed palette tokens (MVP — hexes are starting points to finalize)
```
Nothing signal red   #E10F1C   (brand accent — verify against official assets)
CMF orange           #FF6A00   (sub-brand accent)
Soot black           #0C0C0E   (dark bg, "transparent-back" near-black)
Graphite             #161618   (dark surface)
Steel grey           #3A3A3D   (borders/line numbers, dark)
White                #FAFAFA   (light bg)
Milk                 #F4F1EA   (warm light variant)
Ink                  #1A1A1C   (light text / dark on light)
Ghost white          #E9E9EB   (light surface)
```
Syntax color strategy: keep monochrome-dominant (white/grey text), use the
signal red *only* for keywords/errors, a desaturated orange/amber for
constants/numbers, and restrained green for strings — echoing Nothing OS's
sparse, high-info-density screens rather than a rainbow palette.

---

## 5. MVP Theme Family — Locked Inventory

Family name: **`Nothing`** (single family file `themes/nothing.json` holding all
variants). All **5** flagship themes ship, each mapped to an iconic product, in
an **opaque** (default, safe everywhere) **and a `blurred`** variant for
Windows/macOS users who want the acrylic/blur pass-through. The **primary
highlighted theme is `Nothing Glyph Dark`** (Phone (1) glyph).

| # | Theme name | appearance | Inspired by | Accent | bg.appearance |
|---|------------|------------|-------------|--------|---------------|
| 1 | `Nothing Glyph Dark` | dark | Phone (1) transparent + glyph LEDs | red `#E10F1C` | opaque |
| 1b | `Nothing Glyph Dark (Blurred)` | dark | as above | red | blurred |
| 2 | `Nothing White` | light | Headphone (1) white | red | opaque |
| 2b | `Nothing White (Blurred)` | light | as above | red | blurred |
| 3 | `Nothing Milk` | light | Phone (2a) Milk / warm off-white | red | opaque |
| 3b | `Nothing Milk (Blurred)` | light | as above | red | blurred |
| 4 | `CMF Orange Dark` | dark | CMF Phone (1) Orange | orange `#FF6A00` | opaque |
| 4b | `CMF Orange Dark (Blurred)` | dark | as above | orange | blurred |
| 5 | `CMF Orange Light` | light | CMF Phone (1) Orange (light side) | orange | opaque |
| 5b | `CMF Orange Light (Blurred)` | light | as above | orange | blurred |

> 10 theme entries in one family. Blurred variants are identical except
> `background.appearance: "blurred"` and slightly translucent backgrounds so
> the blur shows; on Linux/Wayland they gracefully degrade to opaque.

### Shared family conventions
- Monochrome base (black / white / milk), one signal accent per sub-brand.
- Borders are thin and structural (Nothing's "structure is ornament").
- Comments are low-contrast (deemphasized), like mute UI text on Nothing OS.
- Strings get a muted green; numbers/booleans a muted amber; keywords/errors the
  signal accent. No neon.
- Terminal ANSI 16 mapped tonally with red/orange honors per sub-brand.

---

## 6. Repo Structure (planned)

```
nothing-theme/
├── .git/                  (initialized)
├── .gitignore
├── extension.toml
├── LICENSE
├── README.md             # install, recommended fonts, screenshots
├── SPEC.md               # this document
└── themes/
    └── nothing.json      # family file w/ all MVP themes (to be authored)
```
Later (post-MVP): `docs/` with screenshot per theme, a screenshot script, a
Palette reference doc.

---

## 7. Roadmap

**M0 — Skeleton (this PR):** repo, git, manifest, LICENSE, SPEC, README stub,
empty `themes/` dir. (Done once you approve.)

**M1 — Author the themes:** hand-craft `themes/nothing.json` using the palette,
mirroring `one.json`'s key coverage so every surface is defined (no accidental
defaults). Validate against the v0.2.0 JSON schema. Load as dev extension and
screenshot each theme in a real buffer (TS, Rust, Python, JSON, markdown).

**M2 — Polish:** tune contrast for accessibility (WCAG AA on editor text),
verify vim-mode highlights, git gutter, diagnostics, terminal, agent panel.
Add recommended-fonts snippet to README.

**M3 — Publish:** push to a public GitHub repo, fork `zed-industries/extensions`,
add submodule + `extensions.toml` entry, open PR with screenshots.

---

## 8. Decisions (locked)

| Q | Decision |
|---|----------|
| Q1 Identity | `id = "nothing-theme"`, family `name = "Nothing"`, repo `nothing-theme` |
| Q2 Author | `osqy <oscarjosehpc@gmail.com>` |
| Q3 License | MIT |
| Q4 MVP themes | All 5 flagship themes |
| Q5 Accent red | `#E10F1C` (no reference available; used as proposed) |
| Q6 Primary | `Nothing Glyph Dark` highlighted as default in README/screenshots |
| Q7 Transparency | Opaque default (all themes) **+ blurred variants for Windows** |
| Q8 Fonts | README includes an Inter (UI) + Lettera Mono (editor) `settings.json` snippet |
| Q9 Publish | Yes — publish to the Zed extension registry (public GitHub repo + PR to `zed-industries/extensions`) |
| Q10 Sources | Yes — `docs/sources.md` crediting Nothing archive, Zed docs, palette references |

---

## 9. Open Questions (archive — resolved, see §8)

**Q1. Extension identity.** Proposed `id = "nothing-theme"`, family `name =
"Nothing"`, repo `nothing-theme`. OK, or do you want a different name (e.g.
`nothing-os-theme`, `dotmatrix-theme`, your own brand)?

**Q2. Author credit.** What name should appear in `authors = [...]` and as the
Git commit author? (Email `oscarjosehpc@gmail.com` is already in your
gitconfig; I set a placeholder `user.name` for this repo.)

**Q3. License.** Default **MIT** (most permissive, simplest). Alternatives the
registry allows: Apache-2.0, BSD-2/3, CC-BY-4.0, GPLv3, LGPLv3, Unlicense,
zlib. Your call?

**Q4. MVP theme set.** Do you want all **5** themes listed in §5, or a tighter
**MVP of 3** (suggestion: `Nothing Glyph Dark`, `Nothing White`, `CMF Orange
Dark`) and ship the rest right after? Any specific product you definitely want
represented that I missed?

**Q5. Accent red value.** I proposed `#E10F1C` for Nothing's red, to be
verified. Do you have a reference hex (e.g. from a wallpaper/official asset),
or should I sample it from the official Phone wallpapers/audio to lock it down?

**Q6. Light vs dark default.** When users install, which should be the
"primary" theme we highlight — the dark Glyph theme or the white Headphone
theme? (Doesn't change files, just README order/screenshots.)

**Q7. Background transparency.** Ship backgrounds as `opaque` (safe
everywhere) by default, or include a `blurred/transparent` variant for
macOS/Windows users (Linux/Wayland blur is unreliable)? I recommend opaque
MVP.

**Q8. Recommended fonts in README.** Want me to include a `settings.json`
snippet recommending e.g. Inter (UI) + Lettera Mono (editor)? Or keep the
README strictly about the theme and leave fonts to the user?

**Q9. Publishing intent.** Is the goal just personal/local use (dev extension),
or do you intend to publish to the Zed extension registry? (Publishing needs a
public GitHub repo and a PR to `zed-industries/extensions`.)

**Q10. Sources / attribution.** Want a `docs/sources.md` crediting the
Nothing archive, Zed docs, and any palette references?