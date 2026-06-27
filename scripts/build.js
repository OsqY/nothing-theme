// Build script for the Nothing Zed theme family.
// Generates themes/nothing.json from tokenized palettes so the 10 theme
// entries (5 flagship products x opaque/blurred) stay DRY and maintainable.
//
//   node scripts/build.js
//
// Schema: https://zed.dev/schema/themes/v0.2.0.json
// Key coverage mirrors Zed's built-in one.json so no surface falls back to a
// default. Unknown/extra keys are harmless (additionalProperties allowed).

const fs = require("fs");
const path = require("path");

// --- color helpers -------------------------------------------------------
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
const parseHex = (h) => {
  const m = h.replace("#", "");
  return [
    parseInt(m.slice(0, 2), 16),
    parseInt(m.slice(2, 4), 16),
    parseInt(m.slice(4, 6), 16),
  ];
};
const rgb = (r, g, b) => `#${[r, g, b].map((x) => clamp(x).toString(16).padStart(2, "0")).join("")}`;
const mix = (a, b, t) => {
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  return rgb(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
};
const lighten = (h, t) => mix(h, "#ffffff", t);
const darken = (h, t) => mix(h, "#000000", t);
const alpha = (h, a) => {
  const [r, g, b] = parseHex(h);
  return `${rgb(r, g, b)}${clamp(Math.round(a * 255)).toString(16).padStart(2, "0")}`;
};

// Nothing palette tokens (final, locked Q5)
const RED = "#E10F1C";    // Nothing signal red
const ORANGE = "#FF6A00"; // CMF sub-brand orange

// structural dark/light anchors
const SOOT = "#0C0C0E";   // near-black "transparent-back"
const GRAPHITE = "#161618";
const CARBON = "#1C1C20";
const STEEL = "#3A3A3D";
const GHOST = "#E9E9EB";  // dark text
const WHITE = "#FAFAFA";  // light bg (Headphone 1 white)
const MILK = "#F4F1EA";   // warm light bg (Phone 2a Milk)
const INK = "#1A1A1C";    // light text
const PAPER = "#ECECEE";
const CREAM = "#E8E4D9";
const CLOUD = "#F2F2F3";
const SAND = "#EFEAE0";
const MIST = "#C9C9CA";

// syntax colors (muted, monochrome-dominant + signal accent for keywords)
const syntax = {
  dark: {
    green: "#8AB36C", amber: "#D9A441", teal: "#7FA6B8", func: "#AEBBCB",
    prop: "#C9B9A6", comment: "#5D636F", commentDoc: "#7B828C",
    punct: "#B8BCC4", punctMute: "#8A8E96", hint: "#8893A8", predict: "#5A6A87",
  },
  light: {
    green: "#6A9F57", amber: "#AD6E25", teal: "#3A7B95", func: "#5E7B99",
    prop: "#A88A6E", comment: "#A2A3A7", commentDoc: "#7C7E86",
    punct: "#4D4F52", punctMute: "#7A7C82", hint: "#5C6E93", predict: "#9B9EC6",
  },
};

// --- syntax style builder ------------------------------------------------
function buildSyntax(appearance, accent) {
  const s = syntax[appearance];
  const kw = accent;
  const fg = appearance === "dark" ? GHOST : INK;
  const S = (color, fontStyle = null, fontWeight = null) => ({ color, font_style: fontStyle, font_weight: fontWeight });
  return {
    attribute: S(kw),
    boolean: S(s.amber),
    comment: S(s.comment),
    "comment.doc": S(s.commentDoc),
    constant: S(s.amber),
    constructor: S(s.func),
    embedded: S(fg),
    emphasis: S(kw),
    "emphasis.strong": S(s.amber, null, 700),
    enum: S(s.teal),
    function: S(s.func),
    hint: S(s.hint),
    keyword: S(kw),
    label: S(kw),
    link_text: S(s.func, "italic"),
    link_uri: S(s.teal),
    namespace: S(fg),
    number: S(s.amber),
    operator: S(s.teal),
    predictive: S(s.predict, "italic"),
    preproc: S(kw),
    primary: S(fg),
    property: S(s.prop),
    punctuation: S(fg),
    "punctuation.bracket": S(s.punct),
    "punctuation.delimiter": S(s.punctMute),
    "punctuation.list_marker": S(kw),
    "punctuation.markup": S(kw),
    "punctuation.special": S(mix(kw, s.prop, 0.4)),
    selector: S(s.green),
    "selector.pseudo": S(kw),
    string: S(s.green),
    "string.escape": S(s.comment),
    "string.regex": S(s.amber),
    "string.special": S(s.amber),
    "string.special.symbol": S(s.amber),
    tag: S(s.teal),
    "text.literal": S(s.green),
    title: S(kw, null, 400),
    type: S(s.teal),
    variable: S(fg),
    "variable.special": S(s.amber),
    variant: S(s.func),
    "diff.plus": S(s.green),
    "diff.minus": S(RED),
  };
}

// --- terminal ANSI builder (all keys prefixed "terminal.") ---------------
function buildTerminal(appearance, accent) {
  const dark = appearance === "dark";
  const fg = dark ? "#D2D4D6" : "#2A2C33";
  const base = {
    black: dark ? SOOT : "#000000",
    red: RED,
    green: syntax[appearance].green,
    yellow: syntax[appearance].amber,
    blue: syntax[appearance].teal,
    magenta: dark ? "#9A7BA8" : "#8A5C8A",
    cyan: dark ? "#6FB0BF" : "#2A8FA8",
    white: dark ? "#B4B6B8" : "#B8BABC",
  };
  const lift = (c, t) => (dark ? lighten(c, t) : darken(c, t));
  const t = {
    "terminal.foreground": fg,
    "terminal.bright_foreground": dark ? GHOST : fg,
    "terminal.dim_foreground": dark ? "#636D83" : "#BBBCBD",
  };
  for (const c of ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]) {
    t[`terminal.ansi.${c}`] = base[c];
    t[`terminal.ansi.bright_${c}`] = dark
      ? lighten(base[c], 0.12)
      : { black: "#444446" }[c] || darken(base[c], 0.05);
    t[`terminal.ansi.dim_${c}`] = darken(base[c], 0.25);
  }
  // bright_black special
  t["terminal.ansi.bright_black"] = dark ? "#454548" : "#444446";
  t["terminal.ansi.dim_black"] = dark ? "#3B3F4A" : "#555555";
  return t; // terminal.background / ansi.background injected by buildStyle
}

// --- full style builder --------------------------------------------------
function buildStyle(p) {
  const dark = p.appearance === "dark";
  const accent = p.accent;
  const bg = p.bg;
  const surface = p.surface;
  const elevated = p.elevated;
  const border = p.border;
  const borderVariant = p.borderVariant;
  const text = p.text;
  const textMuted = p.textMuted;
  const textPlaceholder = mix(textMuted, bg, 0.45);

  const elementHover = mix(surface, dark ? "#2A2A2E" : "#FFFFFF", 0.5);
  const elementActive = dark ? "#2A2A2E" : "#DCDCDD";

  const editorBase = dark ? darken(bg, 0.04) : mix(bg, "#FFFFFF", 0.6);

  // blur: translucent backgrounds so the window blur shows through
  const bgAlpha = p.blurred ? 0.82 : 1.0;
  const surfaceAlpha = p.blurred ? 0.88 : 1.0;
  const editorAlpha = p.blurred ? 0.9 : 1.0;

  const fg = text;
  const syn = syntax[p.appearance];

  const style = {
    // --- structure / borders
    border,
    "border.variant": borderVariant,
    "border.focused": accent,
    "border.selected": mix(accent, bg, 0.55),
    "border.transparent": "#00000000",
    "border.disabled": mix(border, bg, 0.4),

    // --- surfaces
    "elevated_surface.background": alpha(elevated, surfaceAlpha),
    "surface.background": alpha(surface, surfaceAlpha),
    "background": alpha(bg, bgAlpha),
    "background.appearance": p.blurred ? "blurred" : "opaque",

    // --- elements
    "element.background": surface,
    "element.hover": elementHover,
    "element.active": elementActive,
    "element.selected": elementActive,
    "element.disabled": surface,
    "drop_target.background": alpha(accent, 0.25),
    "ghost_element.background": "#00000000",
    "ghost_element.hover": elementHover,
    "ghost_element.active": elementActive,
    "ghost_element.selected": elementActive,
    "ghost_element.disabled": surface,

    // --- text / icons
    "text": text,
    "text.muted": textMuted,
    "text.placeholder": textPlaceholder,
    "text.disabled": textPlaceholder,
    "text.accent": accent,
    "icon": text,
    "icon.muted": textMuted,
    "icon.disabled": textPlaceholder,
    "icon.placeholder": textMuted,
    "icon.accent": accent,

    // --- window chrome
    "status_bar.background": alpha(bg, bgAlpha),
    "title_bar.background": alpha(bg, bgAlpha),
    "title_bar.inactive_background": alpha(surface, surfaceAlpha),
    "toolbar.background": editorBase,
    "tab_bar.background": alpha(bg, bgAlpha),
    "tab.inactive_background": alpha(surface, surfaceAlpha),
    "tab.active_background": elevated,
    "search.match_background": alpha(accent, 0.4),
    "search.active_match_background": alpha(syn.amber, 0.4),
    "panel.background": alpha(surface, surfaceAlpha),
    "panel.focused_border": null,
    "pane.focused_border": null,
    "pane_group.border": borderVariant,

    // --- scrollbar
    "scrollbar.thumb.background": alpha(text, 0.18),
    "scrollbar.thumb.hover_background": mix(surface, text, 0.25),
    "scrollbar.thumb.border": borderVariant,
    "scrollbar.track.background": "#00000000",
    "scrollbar.track.border": borderVariant,

    // --- editor
    "editor.foreground": fg,
    "editor.background": alpha(editorBase, editorAlpha),
    "editor.gutter.background": alpha(editorBase, editorAlpha),
    "editor.subheader.background": surface,
    "editor.active_line.background": alpha(surface, p.blurred ? 0.55 : 0.75),
    "editor.highlighted_line.background": surface,
    "editor.line_number": mix(borderVariant, textMuted, 0.5),
    "editor.active_line_number": text,
    "editor.hover_line_number": textMuted,
    "editor.invisible": alpha(textMuted, 0.6),
    "editor.indent_guide": borderVariant,
    "editor.indent_guide_active": mix(borderVariant, accent, 0.2),
    "editor.wrap_guide": alpha(border, 0.2),
    "editor.active_wrap_guide": alpha(border, 0.35),
    "editor.document_highlight.bracket_background": alpha(accent, 0.15),
    "editor.document_highlight.read_background": alpha(accent, 0.1),
    "editor.document_highlight.write_background": alpha(text, 0.12),

    // --- link
    "link_text.hover": accent,

    // --- version control / git status
    "version_control.added": syn.green,
    "version_control.modified": syn.amber,
    "version_control.word_added": alpha(syn.green, 0.35),
    "version_control.word_deleted": alpha(RED, 0.8),
    "version_control.deleted": RED,
    "version_control.conflict_marker.ours": alpha(syn.green, 0.1),
    "version_control.conflict_marker.theirs": alpha(accent, 0.1),

    // --- status signals (errors are ALWAYS red; accent may differ in CMF)
    "conflict": syn.amber, "conflict.background": alpha(syn.amber, 0.1), "conflict.border": mix(syn.amber, bg, 0.5),
    "created": syn.green, "created.background": alpha(syn.green, 0.1), "created.border": mix(syn.green, bg, 0.5),
    "deleted": RED, "deleted.background": alpha(RED, 0.1), "deleted.border": mix(RED, bg, 0.5),
    "error": RED, "error.background": alpha(RED, 0.1), "error.border": mix(RED, bg, 0.5),
    "hidden": textMuted, "hidden.background": alpha(textMuted, 0.1), "hidden.border": border,
    "hint": syn.hint, "hint.background": alpha(syn.hint, 0.1), "hint.border": mix(syn.hint, bg, 0.5),
    "ignored": textMuted, "ignored.background": alpha(textMuted, 0.08), "ignored.border": borderVariant,
    "info": accent, "info.background": alpha(accent, 0.1), "info.border": mix(accent, bg, 0.5),
    "modified": syn.amber, "modified.background": alpha(syn.amber, 0.1), "modified.border": mix(syn.amber, bg, 0.5),
    "predictive": syn.predict, "predictive.background": alpha(syn.predict, 0.1), "predictive.border": mix(syn.predict, bg, 0.5),
    "renamed": accent, "renamed.background": alpha(accent, 0.1), "renamed.border": mix(accent, bg, 0.5),
    "success": syn.green, "success.background": alpha(syn.green, 0.1), "success.border": mix(syn.green, bg, 0.5),
    "unreachable": textMuted, "unreachable.background": alpha(textMuted, 0.1), "unreachable.border": border,
    "warning": syn.amber, "warning.background": alpha(syn.amber, 0.1), "warning.border": mix(syn.amber, bg, 0.5),

    // --- multiplayer cursors (monochrome + signal)
    "players": [
      { cursor: accent, background: accent, selection: alpha(accent, 0.24) },
      { cursor: syn.amber, background: syn.amber, selection: alpha(syn.amber, 0.24) },
      { cursor: syn.teal, background: syn.teal, selection: alpha(syn.teal, 0.24) },
      { cursor: syn.green, background: syn.green, selection: alpha(syn.green, 0.24) },
      { cursor: text, background: text, selection: alpha(text, 0.24) },
      { cursor: RED, background: RED, selection: alpha(RED, 0.24) },
      { cursor: mix(accent, text, 0.5), background: mix(accent, text, 0.5), selection: alpha(mix(accent, text, 0.5), 0.24) },
      { cursor: syn.func, background: syn.func, selection: alpha(syn.func, 0.24) },
    ],

    "accents": [accent, syn.amber, syn.teal, syn.green, RED],
    "syntax": buildSyntax(p.appearance, accent),
  };

  // terminal (keys prefixed terminal.* — never clobber the top-level background)
  const term = buildTerminal(p.appearance, accent);
  term["terminal.background"] = alpha(editorBase, editorAlpha);
  term["terminal.ansi.background"] = alpha(editorBase, editorAlpha);
  Object.assign(style, term);

  return style;
}

// --- theme definitions ---------------------------------------------------
function define(name, cfg) {
  return { name, appearance: cfg.appearance, style: buildStyle(cfg) };
}

const darkRed = { appearance: "dark", accent: RED, cmf: false, bg: SOOT, surface: GRAPHITE, elevated: CARBON, border: STEEL, borderVariant: "#232327", text: GHOST, textMuted: "#8A8A8E" };
const darkOrange = { appearance: "dark", accent: ORANGE, cmf: true, bg: SOOT, surface: "#1A1517", elevated: "#231C1F", border: "#4A3A33", borderVariant: "#2A2220", text: GHOST, textMuted: "#948478" };
const lightWhite = { appearance: "light", accent: RED, cmf: false, bg: WHITE, surface: PAPER, elevated: CLOUD, border: MIST, borderVariant: "#DFDFE0", text: INK, textMuted: "#5A5A5C" };
const lightMilk = { appearance: "light", accent: RED, cmf: false, bg: MILK, surface: CREAM, elevated: SAND, border: "#D4CFBF", borderVariant: "#E2DCCB", text: INK, textMuted: "#635F54" };
const lightOrange = { appearance: "light", accent: ORANGE, cmf: true, bg: "#FAF6F2", surface: "#F2EAE0", elevated: "#F7F0E7", border: "#E0CFB8", borderVariant: "#ECE0CE", text: INK, textMuted: "#6A5A48" };

const baseThemes = [
  { def: "Nothing Glyph Dark", cfg: darkRed },
  { def: "Nothing White", cfg: lightWhite },
  { def: "Nothing Milk", cfg: lightMilk },
  { def: "CMF Orange Dark", cfg: darkOrange },
  { def: "CMF Orange Light", cfg: lightOrange },
];

const themes = [];
for (const t of baseThemes) {
  themes.push(define(t.def, { ...t.cfg, blurred: false }));
  themes.push(define(`${t.def} (Blurred)`, { ...t.cfg, blurred: true }));
}

const family = {
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name: "Nothing",
  author: "osqy",
  themes,
};

const outDir = path.join(__dirname, "..", "themes");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "nothing.json");
fs.writeFileSync(outFile, JSON.stringify(family, null, 2) + "\n");
console.log(`wrote ${outFile} — ${themes.length} themes`);