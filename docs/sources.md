# Sources & Attribution

This is a **fan-made, community theme** and is **not affiliated with, endorsed
by, or sponsored by Nothing Technology Limited**. The “Nothing” name and
product references are used only to describe the design language that inspired
the color and structure choices.

## Zed editor

- Theme Extensions — https://zed.dev/docs/extensions/themes
- Developing Extensions — https://zed.dev/docs/extensions/developing-extensions
- Themes (config / local themes) — https://zed.dev/docs/themes
- Theme JSON Schema (v0.2.0) — https://zed.dev/schema/themes/v0.2.0.json
- Built-in `one.json` reference (One Dark / One Light) —
  https://github.com/zed-industries/zed/blob/main/assets/themes/one/one.json
  (used as a structural template for full key coverage)
- Extension publishing rules / license requirements —
  https://github.com/zed-industries/extensions
- Theme Builder (visual tool) — https://zed.dev/theme-builder

## Nothing design language & products

- Nothing Phone (1) — transparent back, **Glyph Interface** (900+ white LEDs):
  https://www.nothing.tech/products/phone-1
- Nothing Headphone (1) — white / transparent ear cups, KEF-tuned:
  https://us.nothing.tech/products/headphone-1
- Nothing Phone (2a) — “the eyes”, milk/white/black variants:
  https://intl.nothing.tech/products/phone-2a
- CMF Phone (1) — visible screws, **Orange** vegan leather back:
  https://intl.nothing.tech/products/cmf-phone-1
- Nothing OS typography (NDot-55/57, NType82, Lettera Mono, Inter):
  https://en.wikipedia.org/wiki/Nothing_(company)
- Brand analysis (“subtract don’t add”, “structure is ornament”):
  https://crewtangle.com/nothings-carefully-crafted-brand/
- Nothing system dumps / fonts archive (community-preserved OEM resources,
  including font references used for the README font recommendations):
  https://github.com/spike0en/nothing_archive
- Official Glyph Developer Kit — https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit

## Palette notes

- Nothing signal red `#E10F1C` was chosen as the brand accent without an official
  hex reference available (SPEC §Q5); it is a close visual match to the red used
  in Nothing’s glyph/notification marketing and may be refined in M2 by sampling
  official wallpapers.
- CMF orange `#FF6A00` approximates the vegan-leather orange of the CMF Phone (1).
- Syntax colors are intentionally muted and monochrome-dominant to echo the
  information-dense, low-chroma Nothing OS aesthetic while retaining code
  readability (a pragmatic compromise over fully monochrome syntax).

## Fonts (recommended, not bundled)

Zed themes cannot ship fonts. These are recommendations for `settings.json`
documented in the README; users must obtain fonts themselves from their
respective vendors:

- Inter — https://rsms.me/inter/ (UI text)
- Lettera Mono — https://fontesk.com/ (monospace; available via the
  tadiphone system dump referenced in the nothing_archive)
- Ndot / NType82 — dot-matrix display type (nothing_archive references)