# Nothing Theme for Zed

A theme extension for the [Zed](https://zed.dev) editor inspired by the
industrial, dot-matrix, monochrome design language of **Nothing Technology**.

> ⚠️ Fan-made community theme. **Not affiliated with or endorsed by Nothing
> Technology Limited.** Product/brand names are referenced for design
> inspiration only. See [`docs/sources.md`](./docs/sources.md).

## Themes

10 variants in one family, mapping each flagship product to a theme — every one
available **opaque** (default, safe everywhere) and **blurred** (acrylic/window
blur pass-through on Windows & macOS; degrades gracefully to opaque on Linux).

| Theme | Appearance | Inspired by | Accent |
|-------|------------|-------------|--------|
| **Nothing Glyph Dark** ⭐ | dark | Phone (1) transparent + glyph LEDs | red |
| Nothing Glyph Dark (Blurred) | dark | as above | red |
| Nothing White | light | Headphone (1) white | red |
| Nothing White (Blurred) | light | as above | red |
| Nothing Milk | light | Phone (2a) Milk warm off-white | red |
| Nothing Milk (Blurred) | light | as above | red |
| CMF Orange Dark | dark | CMF Phone (1) Orange | orange |
| CMF Orange Dark (Blurred) | dark | as above | orange |
| CMF Orange Light | light | CMF Phone (1) Orange (light) | orange |
| CMF Orange Light (Blurred) | light | as above | orange |

⭐ `Nothing Glyph Dark` is the highlighted default.

Full design rationale, palette tokens, and roadmap: [`SPEC.md`](./SPEC.md).

## Install as a dev extension (local)

1. Zed → command palette → `zed: extensions`.
2. Click **Install Dev Extension** → select this repository folder.
3. Open the theme selector: `theme selector: toggle` (`Ctrl-K Ctrl-T`) and pick
   a `Nothing …` or `CMF …` theme.
4. For verbose logs while iterating: `zed --foreground`.

> Themes are pure JSON — **no Rust/cargo toolchain required** to build/install.

## Recommended fonts (optional)

Themes can’t change fonts, but these pair well with the Nothing aesthetic. Add
to your `~/.config/zed/settings.json`:

```jsonc
{
  "ui_font_family": "Inter",
  "buffer_font_family": "Lettera Mono" // or "Geist Mono" for an alternative mono
}
```

Sources for fonts are listed in [`docs/sources.md`](./docs/sources.md) — the
extension does not bundle any fonts.

## Rebuild the theme file

The committed `themes/nothing.json` is generated; regenerate after palette edits:

```bash
node scripts/build.js
```

## License

MIT — see [`LICENSE`](./LICENSE).