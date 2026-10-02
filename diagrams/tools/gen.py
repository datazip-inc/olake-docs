#!/usr/bin/env python3
"""Generate the OLake architecture diagram set.

Outputs, all from this one source of truth:
  olake-architecture.drawio   multi-page, editable in draw.io / Lucid / Miro
  olake-shape-library.xml     draw.io library of the reusable components
  previews/*.svg              same geometry, for visual review

Design language v2: vendor marks on source systems, UML component + interface
notation for the code-shaped parts, real rows in every table, and colour that
carries meaning at full strength (zone tabs and 2px strokes, not pastel washes).
"""
import base64
import html as H
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
# when this lives in diagrams/tools/, the artefacts belong in diagrams/
OUT = os.path.dirname(HERE) if os.path.basename(HERE) == "tools" else HERE
PREV = os.path.join(OUT, "previews")
os.makedirs(PREV, exist_ok=True)
ICONS = json.load(open(os.path.join(HERE, "icons.json")))

# ---------------------------------------------------------------- tokens
INK = "#0B1220"
SUB = "#5A6B82"
FAINT = "#C3CEDD"
WHITE = "#FFFFFF"
FONT = "Helvetica"
MONO = "Courier New"

# hue: (stroke/solid, tint fill, zone wash, deep text)
HUE = {
    "olake": ("#193AE6", "#DCE4FE", "#EFF3FF", "#0F2BB5"),
    "ext":   ("#475A70", "#E6EBF2", "#F4F7FA", "#33445A"),
    "green": ("#059669", "#CFF3E2", "#EDFAF3", "#046B4D"),
    "amber": ("#D97706", "#FCE7C2", "#FFF7EA", "#9A5408"),
    "rose":  ("#DC2626", "#FBD9D9", "#FEF1F1", "#A81C1C"),
    "white": ("#8A9AB0", "#FFFFFF", "#FFFFFF", "#0B1220"),
}
EDGE = "#33445A"
EK = {  # edge kinds: colour, width, dashed
    "data":   (EDGE, 1.8, False),
    "meta":   ("#D97706", 1.8, True),
    "commit": ("#059669", 2.6, False),
    "error":  ("#DC2626", 1.8, False),
    "faint":  ("#94A3B8", 1.3, True),
}


# ---------------------------------------------------------------- glyph set
# Line glyphs for concepts (not vendors). Authored once here, exposed on page 00
# and in the shape library so new diagrams reuse them instead of inventing icons.
# "{c}" is replaced with the stroke colour at draw time.
_S = 'fill="none" stroke="{c}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"'
GLYPHS = {
    "classify": f'<rect x="3" y="5" width="18" height="3" rx="1.5" fill="{{c}}"/>'
                f'<rect x="3" y="10.5" width="12.5" height="3" rx="1.5" fill="{{c}}"/>'
                f'<rect x="3" y="16" width="7" height="3" rx="1.5" fill="{{c}}"/>',
    "chunks": f'<rect x="2.5" y="6.5" width="19" height="11" rx="2" {_S}/>'
              f'<path d="M9 6.5v11M15 6.5v11" {_S}/>',
    "types": f'<circle cx="5.6" cy="12" r="3.4" {_S}/><path d="M10.4 12h4.2" {_S}/>'
             f'<path d="M13 10l2 2-2 2" {_S}/>'
             f'<rect x="16.4" y="8.6" width="6.8" height="6.8" rx="1.4" {_S}/>',
    "state": f'<path d="M6 3h8l5 5v13H6z" {_S}/><path d="M14 3v5h5" {_S}/>'
             f'<path d="M9.6 11.6h5.2v6.2l-2.6-2-2.6 2z" fill="{{c}}"/>',
    "buffer": f'<path d="M12 3l9 4.4-9 4.4-9-4.4z" {_S}/><path d="M3 12.2l9 4.4 9-4.4" {_S}/>'
              f'<path d="M3 16.6l9 4.4 9-4.4" {_S}/>',
    "schema": f'<rect x="2" y="4" width="14" height="13" rx="1.6" {_S}/>'
              f'<path d="M2 8.6h14M7 8.6V17" {_S}/>'
              f'<circle cx="18.4" cy="17.4" r="4.6" fill="{{c}}"/>'
              f'<path d="M18.4 15.1v4.6M16.1 17.4h4.6" fill="none" stroke="#FFFFFF" '
              f'stroke-width="1.7" stroke-linecap="round"/>',
    "commit": f'<path d="M12 2.6l8.2 3v6.5c0 5-3.5 8.7-8.2 9.5-4.7-.8-8.2-4.5-8.2-9.5V5.6z" {_S}/>'
              f'<path d="M8.3 12.1l2.7 2.7 5-5.5" {_S}/>',
    "retry": f'<path d="M20.4 12a8.4 8.4 0 1 1-2.9-6.3" {_S}/>'
             f'<path d="M20.8 3.8v4.7h-4.7" {_S}/>',
    "pin": f'<path d="M6 3v18" {_S}/><path d="M6 4.6h12l-2.6 3.5L18 11.6H6z" fill="{{c}}"/>',
    "clock": f'<circle cx="12" cy="12" r="8.6" {_S}/><path d="M12 6.8v5.4l3.4 2" {_S}/>',
    "parallel": f'<path d="M3 6h12M3 12h12M3 18h12" {_S}/>'
                f'<path d="M15.4 3.4l4 2.6-4 2.6M15.4 9.4l4 2.6-4 2.6M15.4 15.4l4 2.6-4 2.6" '
                f'fill="{{c}}"/>',
    "dial": f'<path d="M3.6 17.4a8.9 8.9 0 1 1 16.8 0" {_S}/><path d="M12 17.4l4.4-5.2" {_S}/>'
            f'<circle cx="12" cy="17.4" r="1.6" fill="{{c}}"/>',
    "write": f'<path d="M4.2 19.8l.9-3.9L16.4 4.6a2 2 0 0 1 2.9 2.9L8 18.9z" {_S}/>'
             f'<path d="M14.4 6.6l2.9 2.9" {_S}/><path d="M4 21.6h16" {_S}/>',
    "handoff": f'<path d="M3.4 8.6h13M13.2 5.2l3.4 3.4-3.4 3.4" {_S}/>'
               f'<path d="M20.6 15.4h-13M10.8 12l-3.4 3.4 3.4 3.4" {_S}/>',
    "log": f'<rect x="2.5" y="7" width="19" height="10" rx="1.6" {_S}/>'
           f'<path d="M9 7v10M15 7v10" {_S}/>',
    "search": f'<circle cx="10.4" cy="10.4" r="6.4" {_S}/><path d="M15.1 15.1l5.3 5.3" {_S}/>',
    "table": f'<rect x="2.5" y="4.5" width="19" height="15" rx="1.6" {_S}/>'
             f'<path d="M2.5 9.6h19M9 9.6v9.9M15 9.6v9.9" {_S}/>',
    "delete": f'<path d="M6 3h8l5 5v13H6z" {_S}/><path d="M14 3v5h5" {_S}/>'
              f'<path d="M9 14.4h6" {_S}/>',
    "file": f'<path d="M6 2.8h8.4l5 5v13.4H6z" {_S}/><path d="M14.4 2.8v5h5" {_S}/>'
            f'<path d="M9 13h6M9 16.6h6" {_S}/>',
    "component": f'<rect x="7" y="3.4" width="14.6" height="17.2" rx="1.2" {_S}/>'
                 f'<rect x="2.4" y="7" width="8.6" height="3.6" rx="0.9" {_S}/>'
                 f'<rect x="2.4" y="13.4" width="8.6" height="3.6" rx="0.9" {_S}/>',
    "lock": f'<rect x="4.4" y="10.4" width="15.2" height="10.4" rx="2.2" {_S}/>'
            f'<path d="M8 10.4V7.9a4 4 0 0 1 8 0v2.5" {_S}/>',
}


def esc(s):
    return H.escape(str(s), quote=True)


def fnt(t, s, c, b=False, m=False):
    """One inline run of a draw.io html label."""
    face = f' face="{MONO}"' if m else ""
    seg = f'<font style="font-size: {s}px" color="{c}"{face}>{H.escape(str(t))}</font>'
    return f"<b>{seg}</b>" if b else seg


def segs(txt, size, color, bold=False, mono=False, code=None):
    """Split a label on backticks: `i` renders monospace in the accent colour,
    so bare op codes stand out from the words around them."""
    parts = str(txt).split("`")
    if len(parts) == 1:
        return [(txt, size, color, bold, mono)]
    out = []
    for i, part in enumerate(parts):
        if part == "":
            continue
        is_code = i % 2 == 1
        # SVG/HTML collapse edge whitespace between runs — pin it with nbsp
        if part.startswith(" "):
            part = " " + part[1:]
        if part.endswith(" "):
            part = part[:-1] + " "
        out.append((part, size, (code or color) if is_code else color,
                    True if is_code else bold, mono or is_code))
    return out or [("", size, color, bold, mono)]


def fnt_segs(ss):
    return "".join(fnt(*s) for s in ss)


class Pg:
    """One diagram page: every component emits draw.io cells AND svg, together."""

    def __init__(self, pid, name, W, H_):
        self.pid, self.name, self.W, self.H = pid, name, W, H_
        self.cells, self.svg, self.defs = [], [], []
        self.n = 0
        self.bb = {}

    # ------------------------------------------------ primitives
    def nid(self):
        self.n += 1
        return f"{self.pid}n{self.n}"

    def cell(self, value, style, x, y, w, h, parent="1", off=(0, 0)):
        cid = self.nid()
        self.cells.append(
            f'<mxCell id="{cid}" value="{esc(value)}" style="{esc(style)}" vertex="1" '
            f'parent="{parent}"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" '
            f'as="geometry"/></mxCell>')
        self.bb[cid] = (x + off[0], y + off[1], w, h)
        return cid

    def group(self, x, y, w, h):
        cid = self.nid()
        self.cells.append(
            f'<mxCell id="{cid}" value="" style="group" vertex="1" connectable="0" '
            f'parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" '
            f'as="geometry"/></mxCell>')
        self.bb[cid] = (x, y, w, h)
        return cid

    def A(self, cid, fx, fy):
        x, y, w, h = self.bb[cid]
        return (x + w * fx, y + h * fy)

    # ------------------------------------------------ svg helpers
    def r(self, x, y, w, h, fill, stroke, sw=1.6, rx=8, dash=None):
        d = ' stroke-dasharray="6 4"' if dash else ""
        st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke and stroke != "none" else ""
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" '
                        f'fill="{fill}"{st}{d}/>')

    def t(self, x, y, s, size=13, color=INK, bold=False, anchor="middle", mono=False,
          italic=False):
        fam = MONO if mono else f"{FONT}, Arial, sans-serif"
        fw = ' font-weight="bold"' if bold else ""
        fi = ' font-style="italic"' if italic else ""
        self.svg.append(f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" '
                        f'fill="{color}" text-anchor="{anchor}"{fw}{fi}>{esc(s)}</text>')

    def line(self, pts, color, sw=1.6, dash=False, arrow=True, both=False):
        d = ' stroke-dasharray="6 4"' if dash else ""
        mk = f' marker-end="url(#ar{color[1:]})"' if arrow else ""
        ms = f' marker-start="url(#ar{color[1:]})"' if both else ""
        p = " ".join(f"{a},{b}" for a, b in pts)
        self.svg.append(f'<polyline points="{p}" fill="none" stroke="{color}" '
                        f'stroke-width="{sw}" stroke-linejoin="round"{d}{mk}{ms}/>')

    def runs(self, cx, y, ss, anchor="middle"):
        """One line made of several inline runs (used for `code` spans)."""
        if len(ss) == 1:
            t, s, c, b, m = ss[0]
            return self.t(cx, y, t, s, c, b, anchor=anchor, mono=m)
        parts = []
        for (t, s, c, b, m) in ss:
            fam = MONO if m else f"{FONT}, Arial, sans-serif"
            fw = ' font-weight="bold"' if b else ""
            parts.append(f'<tspan font-family="{fam}" font-size="{s}" fill="{c}"{fw}>'
                         f'{esc(t)}</tspan>')
        self.svg.append(f'<text x="{cx}" y="{y}" text-anchor="{anchor}" '
                        f'xml:space="preserve">' + "".join(parts) + "</text>")

    def _stack(self, cx, cy, lines, lh=1.34, anchor="middle"):
        """lines: list of segment-lists (see segs())."""
        sizes = [max(s[1] for s in ss) for ss in lines]
        total = sum(s * lh for s in sizes)
        y = cy - total / 2
        for ss, s in zip(lines, sizes):
            y += s * lh
            self.runs(cx, y - s * 0.3, ss, anchor=anchor)

    # ------------------------------------------------ text
    def text(self, x, y, w, txt, size=12, color=SUB, bold=False, align="center",
             italic=False, mono=False, h=None):
        cw = size * (0.62 if mono else (0.56 if bold else 0.515))
        maxch = max(6, int(w / cw))
        lines, cur = [], ""
        for word in str(txt).split(" "):
            if cur and len(cur) + 1 + len(word) > maxch:
                lines.append(cur)
                cur = word
            else:
                cur = f"{cur} {word}".strip()
        lines.append(cur)
        style = (f"text;html=1;align={align};verticalAlign=middle;"
                 f"fontFamily={MONO if mono else FONT};fontSize={size};fontColor={color};"
                 + ("fontStyle=3;" if italic and bold else
                    "fontStyle=2;" if italic else "fontStyle=1;" if bold else ""))
        hh = h or max(size + 10, len(lines) * size * 1.3 + 6)
        val = "<br/>".join(H.escape(l) for l in lines) if len(lines) > 1 else txt
        cid = self.cell(val, style, x, y, w, hh)
        cx = x + (w / 2 if align == "center" else 0)
        ty = y + hh / 2 - (len(lines) - 1) * size * 0.65
        for l in lines:
            self.t(cx, ty + size * 0.34, l, size, color, bold,
                   anchor=("middle" if align == "center" else "start"),
                   mono=mono, italic=italic)
            ty += size * 1.3
        return cid

    def title(self, txt, sub=None):
        self.text(56, 24, self.W - 340, txt, size=21, color=INK, bold=True, align="left", h=30)
        if sub:
            self.text(56, 57, self.W - 340, sub, size=12.5, color=SUB, align="left", h=18)
        self.text(self.W - 168, 28, 120, "olake.io", size=11, color="#BAC5D4",
                  align="left", h=16)

    def caption(self, txt, y=None):
        self.text(70, y or (self.H - 50), self.W - 140, txt, size=12.5, color=SUB, italic=True)

    def sectionlabel(self, x, y, txt, w=420):
        self.text(x, y, w, txt, size=11.5, color="#33445A", bold=True, align="left", h=18)

    # ------------------------------------------------ icon / glyph
    def icon(self, name, x, y, size=26, parent="1", off=(0, 0)):
        ic = ICONS[name]
        style = (f"shape=image;html=1;imageAspect=0;aspect=fixed;verticalAlign=top;"
                 f"image=data:image/svg+xml,{ic['b64']};")
        cid = self.cell("", style, x, y, size, size, parent, off)
        vb = ic["vb"]
        s = size / max(vb[2], vb[3])
        ax, ay = x + off[0], y + off[1]
        self.svg.append(f'<g transform="translate({ax},{ay}) scale({s}) '
                        f'translate({-vb[0]},{-vb[1]})">{ic["inner"]}</g>')
        return cid

    def glyph(self, name, x, y, size=22, color=None, parent="1", off=(0, 0)):
        color = color or HUE["olake"][0]
        inner = GLYPHS[name].replace("{c}", color)
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">{inner}</svg>'
        b64 = base64.b64encode(svg.encode()).decode()
        style = (f"shape=image;html=1;imageAspect=0;aspect=fixed;verticalAlign=top;"
                 f"image=data:image/svg+xml,{b64};")
        cid = self.cell("", style, x, y, size, size, parent, off)
        s = size / 24
        ax, ay = x + off[0], y + off[1]
        self.svg.append(f'<g transform="translate({ax},{ay}) scale({s})">{inner}</g>')
        return cid

    # ------------------------------------------------ zone / container
    def zone(self, x, y, w, h, title, sub=None, hue="ext", tab=True):
        s, tint, wash, deep = HUE[hue]
        style = (f"rounded=1;absoluteArcSize=1;arcSize=16;html=1;fillColor={wash};"
                 f"strokeColor={s};strokeWidth=1.6;dashed=0;verticalAlign=top;align=left;"
                 f"spacingTop=44;spacingLeft=18;fontFamily={FONT};fontSize=11.5;"
                 f"fontColor={SUB};")
        cid = self.cell(sub or "", style, x, y, w, h)
        self.r(x, y, w, h, wash, s, 1.6, rx=16)
        if tab:
            tw = 24 + len(title) * 7.9
            self.cell(fnt(title, 12.5, WHITE, True),
                      f"rounded=1;arcSize=40;html=1;fillColor={s};strokeColor=none;"
                      f"fontFamily={FONT};fontSize=12.5;fontColor={WHITE};fontStyle=1;",
                      x + 16, y - 14, tw, 28)
            self.r(x + 16, y - 14, tw, 28, s, "none", 0, rx=14)
            self.t(x + 16 + tw / 2, y + 4.5, title, 12.5, WHITE, True)
        if sub:
            self.t(x + 18, y + 36, sub, 11.5, SUB, anchor="start")
        return cid

    def _lines(self, title, subs, tsize, hue, ssize=10.8, mono_sub=False, scolor=None):
        s, tint, wash, deep = HUE[hue]
        code = deep if hue in ("olake", "green", "amber", "rose") else HUE["olake"][3]
        out = [segs(title, tsize, INK, True, False, code)]
        for e in subs:
            if e:
                out.append(segs(e, ssize, scolor or SUB, False, mono_sub, code))
        return out

    # ------------------------------------------------ UML component (module)
    def component(self, x, y, w, h, title, sub=None, sub2=None, hue="olake",
                  tsize=13, mono_sub=False, on_wash=False, glyph=None):
        s, tint, wash, deep = HUE[hue]
        fill = WHITE if on_wash else tint
        lines = self._lines(title, (sub, sub2), tsize, hue, mono_sub=mono_sub)
        tx = 60 if glyph else 0
        style = (f"rounded=1;absoluteArcSize=1;arcSize=6;html=1;whiteSpace=wrap;"
                 f"fillColor={fill};strokeColor={s};strokeWidth=1.8;"
                 + (f"align=left;spacingLeft={tx};" if glyph else "align=center;")
                 + f"spacingRight=26;fontFamily={FONT};fontSize={tsize};fontColor={INK};")
        cid = self.cell("<br/>".join(fnt_segs(l) for l in lines), style, x, y, w, h)
        self.r(x, y, w, h, fill, s, 1.8, rx=6)
        # UML component marker in the corner — nothing protrudes, so an incoming
        # arrowhead can never land on it
        self.glyph("component", x + w - 25, y + 7, 17, s)
        if glyph:
            self.glyph(glyph, x + 18, y + h / 2 - 14, 28, s)
        self._stack(x + tx if glyph else x + w / 2 - 8, y + h / 2, lines,
                    anchor="start" if glyph else "middle")
        return cid

    # ------------------------------------------------ plain node
    def node(self, x, y, w, h, title, sub=None, sub2=None, hue="ext", tsize=13,
             mono_sub=False, on_wash=False, arc=9, dashed=False, ssize=10.8,
             scolor=None, parent="1", off=(0, 0), glyph=None, mark=None):
        s, tint, wash, deep = HUE[hue]
        fill = WHITE if on_wash else tint
        lines = self._lines(title, (sub, sub2), tsize, hue, ssize, mono_sub, scolor)
        tx = 58 if (glyph or mark) else 0
        style = (f"rounded=1;absoluteArcSize=1;arcSize={arc};whiteSpace=wrap;html=1;"
                 f"fillColor={fill};strokeColor={s};strokeWidth=1.8;fontFamily={FONT};"
                 f"fontSize={tsize};fontColor={INK};"
                 + (f"align=left;spacingLeft={tx};" if tx else "")
                 + ("dashed=1;dashPattern=6 4;" if dashed else ""))
        cid = self.cell("<br/>".join(fnt_segs(l) for l in lines), style, x, y, w, h,
                        parent, off)
        ax, ay = x + off[0], y + off[1]
        self.r(ax, ay, w, h, fill, s, 1.8, rx=arc, dash=dashed)
        if glyph:
            self.glyph(glyph, x + 16, y + h / 2 - 14, 28, s, parent, off)
        if mark:
            self.icon(mark, x + 16, y + h / 2 - 14, 28, parent, off)
        self._stack(ax + tx if tx else ax + w / 2, ay + h / 2, lines,
                    anchor="start" if tx else "middle")
        return cid

    # ------------------------------------------------ vendor card
    def vendor(self, x, y, w, h, name, ic, sub=None, hue="ext", parent="1", off=(0, 0)):
        """Compact: icon + name, sized to its content — never a wide empty card."""
        s, tint, wash, deep = HUE[hue]
        g = self.group(x, y, w, h)
        self.cell("", f"rounded=1;absoluteArcSize=1;arcSize=9;html=1;fillColor={WHITE};"
                      f"strokeColor={s};strokeWidth=1.6;", 0, 0, w, h, g, (x, y))
        self.r(x, y, w, h, WHITE, s, 1.6, rx=9)
        isz = 26
        self.icon(ic, 11, (h - isz) / 2, isz, g, (x, y))
        lines = [(name, 12, INK, True, False)]
        if sub:
            lines.append((sub, 10, SUB, False, False))
        self.cell("<br/>".join(fnt(*l) for l in lines),
                  f"text;html=1;align=left;verticalAlign=middle;fontFamily={FONT};"
                  f"fontSize=12;fontColor={INK};", 11 + isz + 8, 0, w - isz - 24, h, g, (x, y))
        total = sum(sz * 1.3 for (_, sz, _, _, _) in lines)
        ty = y + h / 2 - total / 2
        for (txt, sz, c, b, m) in lines:
            ty += sz * 1.3
            self.t(x + 11 + isz + 8, ty - sz * 0.28, txt, sz, c, b, anchor="start")
        return g

    # ------------------------------------------------ destination table card
    def tablecard(self, x, y, w, h, name, sub="Iceberg", hue="green", mark="iceberg",
                  parent="1", off=(0, 0)):
        """A *table* in a destination — grid glyph, never a bare rectangle."""
        s, tint, wash, deep = HUE[hue]
        g = self.group(x, y, w, h)
        self.cell("", f"rounded=1;absoluteArcSize=1;arcSize=9;html=1;fillColor={tint};"
                      f"strokeColor={s};strokeWidth=1.8;", 0, 0, w, h, g, (x, y))
        self.r(x, y, w, h, tint, s, 1.8, rx=9)
        self.glyph("table", 14, h / 2 - 13, 26, s, g, (x, y))
        lines = [(name, 12.5, INK, True, False)]
        if sub:
            lines.append((sub, 10.4, SUB, False, False))
        self.cell("<br/>".join(fnt(*l) for l in lines),
                  f"text;html=1;align=left;verticalAlign=middle;fontFamily={FONT};"
                  f"fontSize=12.5;fontColor={INK};", 50, 0, w - 96, h, g, (x, y))
        total = sum(sz * 1.32 for (_, sz, _, _, _) in lines)
        ty = y + h / 2 - total / 2
        for (txt, sz, c, b, m) in lines:
            ty += sz * 1.32
            self.t(x + 50, ty - sz * 0.28, txt, sz, c, b, anchor="start")
        if mark:
            self.icon(mark, w - 44, h / 2 - 13, 26, g, (x, y))
        self.bb[g] = (x, y, w, h)
        return g

    # ------------------------------------------------ source system + its streams
    def sourcedb(self, x, y, w, h, name, ic, sub=None, streams=(), hue="ext",
                 stream_label=None):
        """Cylinder for the system, with the streams it holds listed inside it."""
        s, tint, wash, deep = HUE[hue]
        style = (f"shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;"
                 f"size=12;fillColor={tint};strokeColor={s};strokeWidth=1.8;"
                 f"fontFamily={FONT};fontSize=13;fontColor={INK};verticalAlign=top;"
                 f"spacingTop=8;")
        lines = [(name, 13.5, INK, True, False)]
        if sub:
            lines.append((sub, 10.6, SUB, False, False))
        cid = self.cell("<br/>".join(fnt(*l) for l in lines), style, x, y, w, h)
        ry = 12
        self.svg.append(f'<path d="M {x} {y+ry} A {w/2} {ry} 0 0 1 {x+w} {y+ry} L {x+w} '
                        f'{y+h-ry} A {w/2} {ry} 0 0 1 {x} {y+h-ry} Z" fill="{tint}" '
                        f'stroke="{s}" stroke-width="1.8"/>')
        self.svg.append(f'<path d="M {x} {y+ry} A {w/2} {ry} 0 0 0 {x+w} {y+ry}" fill="none" '
                        f'stroke="{s}" stroke-width="1.8"/>')
        self.icon(ic, x + w / 2 - 21, y + 32, 42)
        cy = y + 82
        self._stack(x + w / 2, cy + 8, [segs(l[0], l[1], l[2], l[3]) for l in lines])
        if streams:
            ly = cy + 34
            if stream_label:
                self.text(x, ly, w, stream_label, size=9.8, h=14)
                ly += 16
            for st in streams:
                self.chip(x + 18, ly, w - 36, 26, st, hue="white", tsize=10.5, mono=True)
                ly += 32
        return cid

    # ------------------------------------------------ store shapes
    def cylinder(self, x, y, w, h, title, sub=None, hue="ext", ic=None, tsize=13,
                 glyph=None):
        s, tint, wash, deep = HUE[hue]
        lines = self._lines(title, (sub,), tsize, hue)
        style = (f"shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;"
                 f"size=12;fillColor={tint};strokeColor={s};strokeWidth=1.8;"
                 f"fontFamily={FONT};fontSize={tsize};fontColor={INK};verticalAlign=middle;"
                 + (f"spacingTop=26;" if (ic or glyph) else ""))
        cid = self.cell("<br/>".join(fnt_segs(l) for l in lines), style, x, y, w, h)
        ry = 12
        self.svg.append(f'<path d="M {x} {y+ry} A {w/2} {ry} 0 0 1 {x+w} {y+ry} L {x+w} '
                        f'{y+h-ry} A {w/2} {ry} 0 0 1 {x} {y+h-ry} Z" fill="{tint}" '
                        f'stroke="{s}" stroke-width="1.8"/>')
        self.svg.append(f'<path d="M {x} {y+ry} A {w/2} {ry} 0 0 0 {x+w} {y+ry}" fill="none" '
                        f'stroke="{s}" stroke-width="1.8"/>')
        # icon and text share the barrel: icon on top, text under it, both centred
        isz = 44 if (ic or glyph) else 0
        text_h = sum(max(g[1] for g in l) * 1.34 for l in lines)
        block = isz + (12 if isz else 0) + text_h
        top = y + ry + (h - 2 * ry - block) / 2
        if ic:
            self.icon(ic, x + w / 2 - isz / 2, top, isz)
        elif glyph:
            self.glyph(glyph, x + w / 2 - isz / 2, top, isz, s)
        self._stack(x + w / 2, top + isz + (12 if isz else 0) + text_h / 2, lines)
        return cid

    def filenote(self, x, y, w, h, title, sub=None, sub2=None, hue="amber", tsize=12,
                 mono_title=False, stack=False):
        s, tint, wash, deep = HUE[hue]
        if stack:
            for o in (8, 4):
                self.cell("", f"shape=note;html=1;size=12;fillColor={WHITE};strokeColor={s};"
                              f"strokeWidth=1.3;", x + o, y - o, w, h)
                self.svg.append(f'<path d="M {x+o} {y-o} L {x+o+w-12} {y-o} L {x+o+w} {y-o+12} '
                                f'L {x+o+w} {y-o+h} L {x+o} {y-o+h} Z" fill="{WHITE}" '
                                f'stroke="{s}" stroke-width="1.3"/>')
        lines = [segs(title, tsize, INK, True, mono_title, deep)]
        for e in (sub, sub2):
            if e:
                lines.append(segs(e, 10.4, SUB, False, False, deep))
        style = (f"shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;"
                 f"size=14;fillColor={tint};strokeColor={s};strokeWidth=1.8;"
                 f"fontFamily={FONT};fontSize={tsize};fontColor={INK};")
        cid = self.cell("<br/>".join(fnt_segs(l) for l in lines), style, x, y, w, h)
        k = 14
        self.svg.append(f'<path d="M {x} {y} L {x+w-k} {y} L {x+w} {y+k} L {x+w} {y+h} '
                        f'L {x} {y+h} Z" fill="{tint}" stroke="{s}" stroke-width="1.8"/>')
        self.svg.append(f'<path d="M {x+w-k} {y} L {x+w-k} {y+k} L {x+w} {y+k}" fill="none" '
                        f'stroke="{s}" stroke-width="1.3"/>')
        self._stack(x + w / 2, y + h / 2, lines)
        return cid

    def bucket(self, x, y, w, h, title, sub=None, hue="green"):
        s, tint, wash, deep = HUE[hue]
        g = self.group(x, y, w, h)
        self.cell("", f"rounded=1;absoluteArcSize=1;arcSize=9;html=1;fillColor={tint};"
                      f"strokeColor={s};strokeWidth=1.8;", 0, 0, w, h, g, (x, y))
        self.r(x, y, w, h, tint, s, 1.8, rx=9)
        self.icon("s3", w / 2 - 20, 14, 40, g, (x, y))
        lines = self._lines(title, (sub,), 12.5, hue)
        self.cell("<br/>".join(fnt_segs(l) for l in lines),
                  f"text;html=1;align=center;verticalAlign=middle;fontFamily={FONT};",
                  0, 54, w, h - 58, g, (x, y))
        self._stack(x + w / 2, y + 54 + (h - 58) / 2, lines)
        self.bb[g] = (x, y, w, h)
        return g

    # ------------------------------------------------ code note (real content)
    def codenote(self, x, y, w, title, code_lines, hue="amber", note=None):
        """A file, showing what is actually inside it."""
        s, tint, wash, deep = HUE[hue]
        h = 34 + len(code_lines) * 16 + 12
        style = (f"shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;"
                 f"size=14;fillColor={tint};strokeColor={s};strokeWidth=1.8;align=left;"
                 f"verticalAlign=top;spacingLeft=14;spacingTop=8;fontFamily={FONT};"
                 f"fontSize=12;fontColor={INK};")
        body = fnt(title, 12.5, INK, True) + "<br/>" + "<br/>".join(
            fnt(l.replace(" ", "&nbsp;"), 10.5, deep, False, True) for l in code_lines)
        cid = self.cell(body, style, x, y, w, h)
        k = 14
        self.svg.append(f'<path d="M {x} {y} L {x+w-k} {y} L {x+w} {y+k} L {x+w} {y+h} '
                        f'L {x} {y+h} Z" fill="{tint}" stroke="{s}" stroke-width="1.8"/>')
        self.svg.append(f'<path d="M {x+w-k} {y} L {x+w-k} {y+k} L {x+w} {y+k}" fill="none" '
                        f'stroke="{s}" stroke-width="1.3"/>')
        self.t(x + 14, y + 22, title, 12.5, INK, True, anchor="start")
        for i, l in enumerate(code_lines):
            self.t(x + 14, y + 44 + i * 16, l, 10.5, deep, anchor="start", mono=True)
        if note:
            self.text(x + 2, y + h + 7, max(w, 300), note, size=10.4, align="left")
        return cid

    # ------------------------------------------------ data table (real rows)
    def datatable(self, x, y, cols, rows, widths, title=None, hue="ext", mark=None,
                  rh=25, hh=27, mono_cols=(), note=None):
        """cols: header strings. rows: list of row cell lists. mark: {row_idx: hue}."""
        s, tint, wash, deep = HUE[hue]
        w = sum(widths)
        h = hh + rh * len(rows)
        mark = mark or {}
        g = self.group(x, y, w, h)
        if title:
            self.text(x + 2, y - 26, max(w, 300), title, size=11.5, color=deep, bold=True,
                      align="left", h=18)
        # frame
        self.cell("", f"rounded=0;html=1;fillColor={WHITE};strokeColor={s};strokeWidth=1.6;",
                  0, 0, w, h, g, (x, y))
        self.r(x, y, w, h, WHITE, s, 1.6, rx=2)
        # header band
        self.cell("", f"rounded=0;html=1;fillColor={tint};strokeColor={s};strokeWidth=1.6;",
                  0, 0, w, hh, g, (x, y))
        self.r(x, y, w, hh, tint, s, 1.6, rx=2)
        cx = 0
        for i, c in enumerate(cols):
            self.cell(fnt(c, 10.5, deep, True, i in mono_cols),
                      f"text;html=1;align=left;verticalAlign=middle;fontFamily={FONT};"
                      f"fontSize=10.5;fontColor={deep};", cx + 8, 0, widths[i] - 10, hh,
                      g, (x, y))
            self.t(x + cx + 8, y + hh / 2 + 3.6, c, 10.5, deep, True, anchor="start",
                   mono=(i in mono_cols))
            cx += widths[i]
        # rows
        for r_i, row in enumerate(rows):
            ry = hh + r_i * rh
            rhue = mark.get(r_i)
            rf = HUE[rhue][1] if rhue else WHITE
            if rhue:
                self.cell("", f"rounded=0;html=1;fillColor={rf};strokeColor=none;",
                          1, ry, w - 2, rh, g, (x, y))
                self.r(x + 1, y + ry, w - 2, rh, rf, "none", 0, rx=0)
            self.cell("", f"shape=line;strokeColor=#DEE5EE;strokeWidth=1;fillColor=none;",
                      0, ry, w, 1, g, (x, y))
            self.svg.append(f'<line x1="{x}" y1="{y+ry}" x2="{x+w}" y2="{y+ry}" '
                            f'stroke="#DEE5EE" stroke-width="1"/>')
            cx = 0
            for c_i, cellv in enumerate(row):
                tc = HUE[rhue][3] if rhue else INK
                ss = segs(cellv, 11, tc, False, c_i in mono_cols, deep)
                self.cell(fnt_segs(ss),
                          f"text;html=1;align=left;verticalAlign=middle;fontFamily="
                          f"{MONO if c_i in mono_cols else FONT};fontSize=11;fontColor={tc};",
                          cx + 8, ry, widths[c_i] - 10, rh, g, (x, y))
                self.runs(x + cx + 8, y + ry + rh / 2 + 3.8, ss, anchor="start")
                cx += widths[c_i]
        # column separators
        cx = 0
        for wd in widths[:-1]:
            cx += wd
            self.cell("", f"shape=line;direction=north;strokeColor=#DEE5EE;strokeWidth=1;"
                          f"fillColor=none;", cx, 0, 1, h, g, (x, y))
            self.svg.append(f'<line x1="{x+cx}" y1="{y}" x2="{x+cx}" y2="{y+h}" '
                            f'stroke="#DEE5EE" stroke-width="1"/>')
        if note:
            self.text(x + 2, y + h + 7, max(w, 300), note, size=10.4, color=SUB, align="left")
        self.bb[g] = (x, y, w, h)
        return g

    # ------------------------------------------------ UML interface
    def interface(self, x, y, w, name, groups, note=None, hue="olake"):
        """groups: [(section label, [method(), ...]), ...] — HLD interface box."""
        s, tint, wash, deep = HUE[hue]
        head = 52
        body = sum(20 + 19 * len(ms) for _, ms in groups) + 10
        h = head + body
        g = self.group(x, y, w, h)
        self.cell("", f"rounded=1;absoluteArcSize=1;arcSize=8;html=1;fillColor={WHITE};"
                      f"strokeColor={s};strokeWidth=1.8;", 0, 0, w, h, g, (x, y))
        self.r(x, y, w, h, WHITE, s, 1.8, rx=8)
        # header
        self.cell("", f"rounded=1;absoluteArcSize=1;arcSize=8;html=1;fillColor={s};"
                      f"strokeColor=none;", 0, 0, w, head, g, (x, y))
        self.r(x, y, w, head, s, "none", 0, rx=8)
        self.r(x, y + head - 10, w, 10, s, "none", 0, rx=0)
        self.cell(fnt("«interface»", 10.5, "#D7DEFA") + "<br/>" + fnt(name, 14, WHITE, True),
                  f"text;html=1;align=left;verticalAlign=middle;fontFamily={FONT};",
                  14, 0, w - 60, head, g, (x, y))
        self.t(x + 14, y + 21, "«interface»", 10.5, "#D7DEFA", anchor="start")
        self.t(x + 14, y + 39, name, 14, WHITE, True, anchor="start")
        # <I> corner badge
        self.cell(fnt("I", 12, s, True),
                  f"ellipse;html=1;fillColor={WHITE};strokeColor={WHITE};strokeWidth=1.6;"
                  f"fontFamily={FONT};fontSize=12;fontColor={s};fontStyle=1;",
                  w - 40, 13, 26, 26, g, (x, y))
        self.svg.append(f'<circle cx="{x+w-27}" cy="{y+26}" r="13" fill="{WHITE}"/>')
        self.t(x + w - 27, y + 30.5, "I", 12, s, True)
        # body
        cy = head + 6
        for label, methods in groups:
            self.cell(fnt(label, 9.6, SUB, False),
                      f"text;html=1;align=left;verticalAlign=middle;fontFamily={FONT};"
                      f"fontSize=9.6;fontColor={SUB};", 14, cy, w - 24, 18, g, (x, y))
            self.t(x + 14, y + cy + 12.5, label.upper(), 9.6, "#8496AC", anchor="start")
            self.svg.append(f'<line x1="{x + 16 + len(label) * 6.2}" y1="{y+cy+9}" '
                            f'x2="{x+w-14}" y2="{y+cy+9}" stroke="#E4EAF2" stroke-width="1"/>')
            cy += 20
            for m in methods:
                self.cell(fnt("+ ", 11, "#9AA9BD") + fnt(m, 11.5, INK, False, True),
                          f"text;html=1;align=left;verticalAlign=middle;fontFamily={MONO};"
                          f"fontSize=11.5;fontColor={INK};", 22, cy, w - 32, 19, g, (x, y))
                self.t(x + 22, y + cy + 13.5, "+", 11, "#9AA9BD", anchor="start")
                self.t(x + 34, y + cy + 13.5, m, 11.5, INK, anchor="start", mono=True)
                cy += 19
        if note:
            self.text(x, y + h + 8, w, note, size=10.5, color=SUB, h=16)
        self.bb[g] = (x, y, w, h)
        return g

    def lollipop(self, x, y, label=None, hue="olake", r=9):
        """Provided-interface ball. Returns id anchored on the ball."""
        s, tint, wash, deep = HUE[hue]
        cid = self.cell("", f"ellipse;html=1;fillColor={WHITE};strokeColor={s};strokeWidth=2;",
                        x - r, y - r, 2 * r, 2 * r)
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{WHITE}" stroke="{s}" '
                        f'stroke-width="2"/>')
        if label:
            self.text(x - 90, y - r - 24, 180, label, size=10.5, color=deep, bold=True, h=16)
        return cid

    def socket(self, x, y, hue="olake", r=15, facing="left"):
        """Required-interface socket (half arc)."""
        s, tint, wash, deep = HUE[hue]
        sweep = 1 if facing == "left" else 0
        style = (f"shape=requires;html=1;direction={'west' if facing=='left' else 'east'};"
                 f"strokeColor={s};strokeWidth=2;fillColor=none;")
        cid = self.cell("", style, x - r, y - r, 2 * r, 2 * r)
        self.svg.append(f'<path d="M {x} {y-r} A {r} {r} 0 0 {sweep} {x} {y+r}" fill="none" '
                        f'stroke="{s}" stroke-width="2"/>')
        return cid

    # ------------------------------------------------ log tape
    def logtape(self, x, y, cells, w=None, cw=54, h=34, label=None, pin=None,
                pin_label=None, tail=True, hue="ext", mark=None):
        """cells: list of cell texts (e.g. 'K2:U'). mark: {idx: hue} to colour cells."""
        s, tint, wash, deep = HUE[hue]
        mark = mark or {}
        n = len(cells)
        w = w or cw * n
        cw = w / n
        g = self.group(x, y, w + 22, h)
        self.cell("", f"rounded=1;absoluteArcSize=1;arcSize=6;html=1;fillColor={WHITE};"
                      f"strokeColor={s};strokeWidth=1.8;", 0, 0, w, h, g, (x, y))
        self.r(x, y, w, h, WHITE, s, 1.8, rx=6)
        for i, c in enumerate(cells):
            mh = mark.get(i)
            if mh:
                mf = HUE[mh][1]
                self.cell("", f"rounded=0;html=1;fillColor={mf};strokeColor=none;",
                          i * cw + 1.5, 1.5, cw - 3, h - 3, g, (x, y))
                self.r(x + i * cw + 1.5, y + 1.5, cw - 3, h - 3, mf, "none", 0, rx=3)
            if i:
                self.cell("", f"shape=line;direction=north;strokeColor=#D5DEE9;"
                              f"strokeWidth=1.1;fillColor=none;", i * cw, 3, 1, h - 6, g, (x, y))
                self.svg.append(f'<line x1="{x+i*cw}" y1="{y+3}" x2="{x+i*cw}" y2="{y+h-3}" '
                                f'stroke="#D5DEE9" stroke-width="1.1"/>')
            if c:
                tc = HUE[mh][3] if mh else INK
                self.cell(fnt(c, 10.5, tc, True, True),
                          f"text;html=1;align=center;verticalAlign=middle;fontFamily={MONO};"
                          f"fontSize=10.5;fontColor={tc};", i * cw, 0, cw, h, g, (x, y))
                self.t(x + i * cw + cw / 2, y + h / 2 + 3.7, c, 10.5, tc, True, mono=True)
        if tail:
            self.cell("", f"triangle;html=1;fillColor={s};strokeColor=none;",
                      w + 5, h / 2 - 7, 12, 14, g, (x, y))
            self.svg.append(f'<path d="M {x+w+5} {y+h/2-7} L {x+w+17} {y+h/2} L {x+w+5} '
                            f'{y+h/2+7} Z" fill="{s}"/>')
        if pin is not None:
            px = w * pin
            self.cell("", f"shape=line;direction=north;strokeColor={HUE['amber'][0]};"
                          f"strokeWidth=2.4;fillColor=none;", px, -6, 1, h + 12, g, (x, y))
            self.svg.append(f'<line x1="{x+px}" y1="{y-6}" x2="{x+px}" y2="{y+h+6}" '
                            f'stroke="{HUE["amber"][0]}" stroke-width="2.4"/>')
            self.cell(fnt("⚑", 13, HUE["amber"][0], True),
                      f"text;html=1;align=center;verticalAlign=middle;fontFamily={FONT};"
                      f"fontSize=13;fontColor={HUE['amber'][0]};", px - 10, -26, 20, 18,
                      g, (x, y))
            self.t(x + px + 1, y - 12, "⚑", 13, HUE["amber"][0], True)
            if pin_label:
                self.text(x + px - 110, y - 46, 220, pin_label, size=10.4,
                          color=HUE["amber"][3], bold=True, h=16)
        if label:
            self.text(x - 20, y + h + 8, w + 40, label, size=10.8, color=SUB, h=16)
        self.bb[g] = (x, y, w, h)
        return g

    # ------------------------------------------------ chunk chip
    def chunk(self, x, y, state="pending", text="", w=62, h=28, tsize=10,
              parent="1", off=(0, 0)):
        cfg = {"pending": (WHITE, "#8A9AB0", SUB), "inflight": (HUE["olake"][0], HUE["olake"][0], WHITE),
               "done": (HUE["green"][0], HUE["green"][0], WHITE),
               "retry": (HUE["rose"][1], HUE["rose"][0], HUE["rose"][3])}
        f, s, tc = cfg[state]
        if state == "done":
            text = (text + " ✓").strip()
        if state == "retry":
            text = (text + " ↻").strip()
        style = (f"rounded=1;absoluteArcSize=1;arcSize=6;whiteSpace=wrap;html=1;fillColor={f};"
                 f"strokeColor={s};strokeWidth=1.6;fontFamily={FONT};fontSize={tsize};"
                 f"fontColor={tc};fontStyle=1;")
        cid = self.cell(text, style, x, y, w, h, parent, off)
        ax, ay = x + off[0], y + off[1]
        self.r(ax, ay, w, h, f, s, 1.6, rx=6)
        if text:
            self.t(ax + w / 2, ay + h / 2 + tsize * 0.36, text, tsize, tc, True)
        return cid

    # ------------------------------------------------ badges
    def disc(self, x, y, n, r=13, hue="olake"):
        s = HUE[hue][0]
        cid = self.cell(str(n), f"ellipse;html=1;fillColor={s};strokeColor={WHITE};"
                                f"strokeWidth=2;fontFamily={FONT};fontSize=13;"
                                f"fontColor={WHITE};fontStyle=1;", x - r, y - r, 2 * r, 2 * r)
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{s}" stroke="{WHITE}" '
                        f'stroke-width="2"/>')
        self.t(x, y + 4.6, str(n), 13, WHITE, True)
        return cid

    def badge(self, x, y, glyph, hue="rose", r=12):
        s, tint, wash, deep = HUE[hue]
        cid = self.cell(glyph, f"ellipse;html=1;fillColor={tint};strokeColor={s};"
                               f"strokeWidth=1.6;fontFamily={FONT};fontSize=13;"
                               f"fontColor={deep};fontStyle=1;", x - r, y - r, 2 * r, 2 * r)
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{tint}" stroke="{s}" '
                        f'stroke-width="1.6"/>')
        self.t(x, y + 4.6, glyph, 13, deep, True)
        return cid

    def chip(self, x, y, w, h, text, hue="white", tsize=11, mono=False, parent="1",
             off=(0, 0)):
        s, tint, wash, deep = HUE[hue]
        style = (f"rounded=1;arcSize=50;whiteSpace=wrap;html=1;fillColor={tint};"
                 f"strokeColor={s};strokeWidth=1.6;fontFamily={MONO if mono else FONT};"
                 f"fontSize={tsize};fontColor={deep};fontStyle=1;")
        cid = self.cell(text, style, x, y, w, h, parent, off)
        ax, ay = x + off[0], y + off[1]
        self.r(ax, ay, w, h, tint, s, 1.6, rx=h / 2)
        self.t(ax + w / 2, ay + h / 2 + tsize * 0.36, text, tsize, deep, True, mono=mono)
        return cid

    # ------------------------------------------------ edges
    def edge(self, a=None, b=None, kind="data", label=None, exit=None, entry=None,
             points=None, pa=None, pb=None, lx=None, ly=None, both=False, arrow=True,
             sw=None, loff=None, fontcolor=None):
        color, width, dashed = EK[kind]
        width = sw or width
        fc = fontcolor or {"meta": HUE["amber"][3], "commit": HUE["green"][3],
                           "error": HUE["rose"][3]}.get(kind, "#33445A")
        # labels sit clear of the line rather than punching a white hole in it:
        # above a horizontal edge, beside a vertical one
        vertical = False
        if label and lx is None and ly is None:
            _a = pa or (self.A(a, *exit) if exit else self.A(a, 1, 0.5) if a else (0, 0))
            _b = pb or (self.A(b, *entry) if entry else self.A(b, 0, 0.5) if b else (0, 0))
            vertical = abs(_b[1] - _a[1]) > abs(_b[0] - _a[0])
            if loff is None:
                loff = -13
        style = (f"html=1;edgeStyle=none;rounded=1;"
                 + ("endArrow=blockThin;endFill=1;endSize=8;" if arrow else "endArrow=none;")
                 + f"strokeWidth={width};strokeColor={color};fontFamily={FONT};fontSize=11;"
                 f"fontColor={fc};labelBackgroundColor=none;verticalAlign=bottom;")
        if dashed:
            style += "dashed=1;dashPattern=6 4;"
        if both:
            style += "startArrow=blockThin;startFill=1;startSize=8;"
        if exit:
            style += f"exitX={exit[0]};exitY={exit[1]};exitDx=0;exitDy=0;"
        if entry:
            style += f"entryX={entry[0]};entryY={entry[1]};entryDx=0;entryDy=0;"
        cid = self.nid()
        geo = '<mxGeometry relative="1" as="geometry">'
        if pa:
            geo += f'<mxPoint x="{pa[0]}" y="{pa[1]}" as="sourcePoint"/>'
        if pb:
            geo += f'<mxPoint x="{pb[0]}" y="{pb[1]}" as="targetPoint"/>'
        if points:
            geo += '<Array as="points">' + "".join(
                f'<mxPoint x="{px}" y="{py}"/>' for px, py in points) + "</Array>"
        if loff:
            geo += (f'<mxPoint as="offset" x="{(len(label or "") * 3.4 + 12) if vertical else 0}"'
                    f' y="{0 if vertical else loff}"/>')
        geo += "</mxGeometry>"
        self.cells.append(
            f'<mxCell id="{cid}" value="{esc(label or "")}" style="{esc(style)}" edge="1" '
            f'parent="1"{f" source={chr(34)}{a}{chr(34)}" if a else ""}'
            f'{f" target={chr(34)}{b}{chr(34)}" if b else ""}>{geo}</mxCell>')
        p0 = pa or (self.A(a, *exit) if exit else self.A(a, 1, 0.5))
        p1 = pb or (self.A(b, *entry) if entry else self.A(b, 0, 0.5))
        pts = [p0] + (points or []) + [p1]
        self.line(pts, color, width, dashed, arrow=arrow, both=both)
        if label:
            mx = lx if lx is not None else sum(p[0] for p in pts) / len(pts)
            my = ly if ly is not None else sum(p[1] for p in pts) / len(pts)
            if vertical:
                self.t(mx + 10, my + 3.6, label, 11, fc, anchor="start")
            else:
                self.t(mx, my + 3.6 + (loff or 0), label, 11, fc)
        return cid

    # ------------------------------------------------ output
    def drawio(self):
        return (f'<diagram id="{self.pid}" name="{esc(self.name)}">'
                f'<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" '
                f'tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" '
                f'pageWidth="{self.W}" pageHeight="{self.H}" math="0" shadow="0" '
                f'background="#FFFFFF"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
                + "".join(self.cells) + "</root></mxGraphModel></diagram>")

    def write_svg(self):
        marks = "".join(
            f'<marker id="ar{c[1:]}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" '
            f'markerHeight="6.5" orient="auto-start-reverse">'
            f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{c}"/></marker>'
            for c in {EDGE, HUE["amber"][0], HUE["green"][0], HUE["rose"][0], "#94A3B8",
                      HUE["olake"][0]})
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.W}" height="{self.H}" '
               f'viewBox="0 0 {self.W} {self.H}"><defs>{marks}</defs>'
               f'<rect width="{self.W}" height="{self.H}" fill="white"/>'
               + "".join(self.svg) + "</svg>")
        path = os.path.join(PREV, f"{self.pid}.svg")
        open(path, "w").write(svg)
        return path


PAGES = []


def page(pid, name, W, H_):
    p = Pg(pid, name, W, H_)
    PAGES.append(p)
    return p


SOURCES = [("PostgreSQL", "postgresql"), ("MySQL", "mysql"), ("MongoDB", "mongodb"),
           ("Oracle", "oracle"), ("SQL Server", "sqlserver"), ("IBM Db2", "db2"),
           ("Apache Kafka", "apachekafka"), ("S3 / MinIO", "s3")]


# ============================================================ 01 overview
def p01():
    p = page("p01", "01 · Pipeline overview", 1720, 830)
    p.title("OLake Go · pipeline overview",
            "one process, one engine: drivers read, the engine plans and supervises, writers commit")
    TOP, CH = 120, 500
    p.zone(56, TOP, 236, CH, "Sources", "8 drivers", hue="ext")
    for i, (nm, ic) in enumerate(SOURCES):
        p.vendor(78, TOP + 74 + i * 50, 192, 40, nm, ic)
    p.text(78, TOP + 480, 192, "native clients & wire protocols", size=10, h=14)
    p.zone(400, TOP, 320, CH, "Sync engine", "shared by every source", hue="olake")
    steps = [("Classify streams", "full load · incremental · CDC", "classify"),
             ("Plan & run", "split chunks · pin log position", "chunks"),
             ("Convert types", "one type system · stamp metadata", "types"),
             ("Track state", "skip already-committed work", "state")]
    ids = [p.component(430, TOP + 76 + i * 100, 262, 66, t, s, hue="olake", on_wash=True,
                       glyph=g) for i, (t, s, g) in enumerate(steps)]
    for i in range(3):
        p.edge(ids[i], ids[i + 1], exit=(0.5, 1), entry=(0.5, 0))
    p.zone(830, TOP, 320, CH, "Writers", "one per reader", hue="olake")
    w = [("Buffer & flatten", "10 000 records · filters applied", "buffer"),
         ("Evolve schema", "safe promotions only", "schema"),
         ("Commit", "atomic · exactly-once", "commit")]
    wid = [p.component(860, TOP + 96 + i * 122, 262, 66, t, s, hue="olake", on_wash=True,
                       glyph=g) for i, (t, s, g) in enumerate(w)]
    p.edge(wid[0], wid[1], exit=(0.5, 1), entry=(0.5, 0))
    p.edge(wid[1], wid[2], exit=(0.5, 1), entry=(0.5, 0))
    p.zone(1270, TOP, 390, CH, "Destinations", "two ways to land", hue="green")
    ice = p.tablecard(1300, TOP + 74, 330, 64, "Apache Iceberg tables", "atomic, exactly-once")
    cat = p.cylinder(1300, TOP + 164, 150, 96, "Catalog", "Glue · Hive · JDBC · REST",
                     hue="ext", tsize=12)
    p.node(1476, TOP + 176, 154, 72, "one commit", "per writer, per chunk", hue="green",
           on_wash=True, tsize=12, glyph="commit")
    p.edge(ice, cat, kind="meta", exit=(0.2, 1), entry=(0.5, 0))
    pq = p.node(1300, TOP + 288, 330, 64, "Parquet files", "no commit — just files",
                hue="green", on_wash=True, mark="apacheparquet")
    obj = p.bucket(1300, TOP + 378, 150, 106, "Object storage", "S3 · GCS · MinIO")
    p.text(1470, TOP + 396, 170, "both destinations write to the same object storage",
           size=10.4, align="left")
    p.edge(pq, obj, kind="faint", exit=(0.2, 1), entry=(0.5, 0), arrow=True)
    st = p.filenote(452, TOP + CH + 46, 240, 68, "state.json",
                    "chunk list · cursor value · log position", hue="amber")
    p.edge(ids[3], st, kind="meta", exit=(0.5, 1), entry=(0.5, 0), both=True)
    p.edge(None, None, pa=(298, TOP + CH / 2), pb=(394, TOP + CH / 2), label="read")
    p.edge(None, None, pa=(726, TOP + CH / 2), pb=(824, TOP + CH / 2), label="records")
    p.edge(None, ice, kind="commit", pa=(1156, TOP + CH / 2), points=[(1230, TOP + 106)],
           entry=(0, 0.5), label="commit", lx=1216, ly=TOP + 92)
    p.edge(None, pq, kind="commit", pa=(1156, TOP + CH / 2), points=[(1230, TOP + 320)],
           entry=(0, 0.5), label="upload", lx=1216, ly=TOP + 336)
    p.caption("A sync is a single process: each driver speaks its source's own protocol, the shared engine "
              "plans and supervises the work, and writers land it in Iceberg or Parquet with an atomic commit.")
    return p


# ============================================================ 02 interface
def p02():
    p = page("p02", "02 · Driver interface", 1720, 740)
    p.title("Eight drivers, one interface",
            "the only per-source code is an implementation of DriverInterface; everything else is shared")
    p.zone(56, 116, 236, 524, "Drivers", "one per source", hue="olake")
    for i, (nm, ic) in enumerate(SOURCES):
        p.vendor(78, 190 + i * 50, 192, 40, nm, ic, hue="olake")
    p.text(78, 592, 192, "each implements the interface, and nothing else", size=10.5, h=16)
    iface = p.interface(
        520, 186, 420, "DriverInterface",
        [("discovery", ["GetStreamNames()", "ProduceSchema()"]),
         ("full load", ["GetOrSplitChunks()", "ChunkIterator()"]),
         ("incremental", ["FetchMaxCursorValues()", "StreamIncrementalChanges()"]),
         ("change data capture", ["CDCSupported()", "ChangeStreamConfig()", "PreCDC()",
                                  "StreamChanges()", "PostCDC()"])],
        note="drivers/abstract · the whole per-source contract")
    ball = p.lollipop(400, 366, hue="olake")
    p.edge(None, ball, pa=(298, 366), pb=(391, 366), arrow=False, sw=2)
    p.edge(None, iface, pa=(409, 366), pb=(514, 366), arrow=False, sw=2)
    p.text(320, 316, 160, "implements", size=10.5, color=HUE["olake"][3], bold=True, h=16)
    sock = p.socket(1030, 366, hue="olake")
    p.edge(None, None, pa=(946, 366), pb=(1016, 366), arrow=False, sw=2)
    p.edge(None, None, pa=(1046, 366), pb=(1118, 366), arrow=False, sw=2)
    p.text(970, 316, 150, "uses", size=10.5, color=HUE["olake"][3], bold=True, h=16)
    p.zone(1120, 116, 546, 524, "Sync engine", "written once, shared by all eight",
           hue="olake")
    caps = [("Parallel execution", "bounded worker pool", "parallel"),
            ("Connection limits", "max_threads, shared", "dial"),
            ("Retries & backoff", "per chunk, per session", "retry"),
            ("State tracking", "state.json + the table", "state"),
            ("Writer lifecycle", "buffer, flush, commit", "write"),
            ("Full load → CDC", "handoff & overlap dedup", "handoff")]
    for i, (t, s, g) in enumerate(caps):
        col, row = i % 2, i // 2
        p.component(1152 + col * 262, 192 + row * 104, 240, 74, t, s, hue="olake",
                    on_wash=True, glyph=g)
    p.text(1152, 520, 502, "a ninth source inherits every one of these the moment its driver compiles",
           size=11, italic=True, h=18)
    p.caption("A driver answers questions about its own database — what streams exist, how to split one, "
              "how to tail its log. The engine on the right owns everything else, which is why all eight "
              "sources behave identically.")
    return p


# ============================================================ 03 chunking
def p03():
    p = page("p03", "03 · Chunked full loads", 1720, 1010)
    p.title("Full loads: split once, run in parallel, resume from state",
            "the chunk is the unit of parallelism, of retry, and of resume — all three at once")
    tbl = p.datatable(56, 168, ["ctid", "id", "customer", "amount"],
                      [["(0,1)", "1", "Alice", "120.00"],
                       ["(0,2)", "2", "Bob", "340.00"],
                       ["(4,7)", "3", "Dan", "90.00"],
                       ["(7,3)", "4", "Erin", "512.00"],
                       ["(9,4)", "5", "Frank", "78.00"],
                       ["(12,2)", "6", "Grace", "233.00"]],
                      [78, 46, 96, 84], title="public.orders — 80 000 rows",
                      mono_cols=(0, 1, 3))
    x0, y0 = 56, 168
    for i, (lo, hi, lab) in enumerate([(0, 2, "chunk 1"), (2, 4, "chunk 2"), (4, 6, "chunk 3")]):
        ty = y0 + 27 + lo * 25
        by = y0 + 27 + hi * 25
        p.svg.append(f'<path d="M {x0+310} {ty+3} h 8 v {by-ty-6} h -8" fill="none" '
                     f'stroke="#8A9AB0" stroke-width="1.3"/>')
        p.cell("", f"shape=curlyBracket;direction=north;html=1;strokeColor=#8A9AB0;"
                   f"strokeWidth=1.3;fillColor=none;rounded=1;", x0 + 308, ty + 3, 10, by - ty - 6)
        p.text(x0 + 324, (ty + by) / 2 - 9, 120, lab, size=10.5, color=SUB, align="left", h=18)
    p.text(56, 350, 304, "chunk boundaries come from cheap metadata — CTID ranges, key ranges, "
                         "splitVector. No data is scanned to plan them.", size=10.5, align="left")
    p.disc(300, 152, 1)
    chunks = [("(0,1)–(4,0)", "done"), ("(4,0)–(9,0)", "done"), ("(9,0)–(14,0)", "inflight"),
              ("(14,0)–(19,0)", "inflight"), ("(19,0)–(24,0)", "inflight"),
              ("(24,0)–(29,0)", "pending"), ("(29,0)–(34,0)", "pending")]
    p.disc(560, 152, 2)
    p.text(500, 168, 320, "chunk list — planned before a single row moves", size=10.5, h=16)
    for i, (r, s) in enumerate(chunks):
        p.chunk(500 + (i % 2) * 132, 196 + (i // 2) * 34, s, r, w=124, h=28, tsize=9.5)
    st = p.codenote(492, 372, 272, "state.json", [
        '"chunks": [',
        '  {"min":"(9,0)", "max":"(14,0)"},',
        '  {"min":"(14,0)","max":"(19,0)"}',
        '],',
        '"global": {"state":',
        '  {"lsn":"0/1A2B3C4D"}}',
    ], note="written before the first row is read, rewritten on every chunk commit")
    p.edge(None, st, kind="meta", pa=(628, 336), entry=(0.5, 0))
    p.zone(880, 130, 500, 400, "Worker pool", "max_threads = 3 — the one dial on source load",
           hue="olake")
    p.disc(880, 152, 3)
    lanes = []
    for i, rng in enumerate(["(9,0)–(14,0)", "(14,0)–(19,0)", "(19,0)–(24,0)"]):
        ly = 200 + i * 100
        p.node(910, ly, 440, 76, "", hue="white", on_wash=True, arc=8)
        p.text(922, ly + 28, 34, f"W{i+1}", size=10, color="#93A3B7", bold=True, align="left", h=20)
        ch = p.chunk(966, ly + 24, "inflight", rng, w=124, h=28, tsize=9.5)
        wr = p.component(1150, ly + 18, 176, 40, "Writer", hue="olake", tsize=12, on_wash=True)
        p.edge(ch, wr, exit=(1, 0.5), entry=(0, 0.5))
        lanes.append(wr)
    p.text(910, 490, 440, "one chunk = one query, one writer, one commit", size=10.5, h=18)
    p.edge(None, None, pa=(776, 300), pb=(872, 300), label="pulled by a free worker",
           lx=824, ly=280)
    p.badge(1352, 358, "↻")
    p.text(880, 552, 500, "a chunk that fails retries on its own — fresh context, fresh writer, "
                          "60 s backoff doubling per attempt", size=10.5, color=HUE["rose"][3],
           align="left")
    p.disc(1440, 152, 4)
    dst = p.cylinder(1450, 200, 200, 210, "Iceberg table", "one file set per chunk", hue="green",
                     ic="iceberg")
    for i, wr in enumerate(lanes):
        p.edge(wr, dst, kind="commit", exit=(1, 0.5), entry=(0, 0.28 + i * 0.22))
    p.edge(None, st, kind="meta", pa=(1550, 416), points=[(1550, 626), (628, 626)],
           entry=(0.5, 1), label="a chunk leaves state.json only after its commit lands",
           lx=1090, ly=612)
    p.datatable(56, 700, ["sync mode", "what state.json holds", "how the next run resumes"],
                [["full load", "the chunk list still outstanding",
                  "re-runs only the chunks left in the list"],
                 ["incremental", "the cursor maximum reached",
                  "reads rows past that value"],
                 ["CDC · PostgreSQL", "the WAL position — `lsn`",
                  "restarts the replication slot at that LSN"],
                 ["CDC · MySQL", "binlog file + position, and the server ID",
                  "reconnects as the same replica, from that position"],
                 ["CDC · MongoDB", "a resume token per stream",
                  "hands the token back via `resumeAfter`"],
                 ["CDC · SQL Server", "the last LSN read per stream",
                  "polls the next LSN range"],
                 ["Kafka", "consumer-group offsets, committed at the broker",
                  "resumes from the committed offset"]],
                [178, 366, 400], title="what actually makes each mode resumable",
                hue="amber", mono_cols=())
    p.text(1050, 700, 600, "Values still in flight — the cursor maximum a reader is tracking, the log "
                           "position it is advancing through — stay in driver memory and only enter "
                           "state.json at a commit point. That is why the file never contains half-done "
                           "progress: whenever the process dies, it already reflects exactly the units of "
                           "work that completed, and nothing else.", size=11.5, align="left")
    p.caption("The complete chunk list is persisted before any data moves (1–2); chunks run through a bounded "
              "pool (3) and each commits alone (4). Kill the process at any point: the next run reads the "
              "surviving list and re-runs only what is left.", y=956)
    return p


# ============================================================ 04-06 CDC
def cdc_page(pid, num, title, subtitle, topology, h=700):
    p = page(pid, f"{num} · CDC — {topology}", 1720, h)
    p.title(title, subtitle)
    return p


def p04():
    p = cdc_page("p04", "04", "Sequential CDC: one ordered log, one reader",
                 "PostgreSQL · MySQL — the whole database shares a single change log",
                 "sequential")
    db = p.sourcedb(56, 210, 210, 252, "PostgreSQL", "postgresql", "or MySQL — one database",
                    streams=["public.orders", "public.users", "public.payments"],
                    stream_label="the streams being synced")
    tape = p.logtape(330, 322, ["K1:I", "K2:U", "K3:D", "K4:I", "K5:U"], cw=60, tail=False,
                     label="WAL / binlog — one ordered log, oldest → newest")
    rd = p.component(700, 302, 232, 74, "One reader", "decodes and routes by stream",
                     hue="olake", glyph="log")
    p.edge(None, None, pa=(268, 338), pb=(324, 338))
    p.edge(None, rd, pa=(638, 339), entry=(0, 0.5), label="tail", lx=668, ly=330)
    rows = [("orders", 170), ("users", 320), ("payments", 470)]
    for nm, y in rows:
        wr = p.component(990, y, 190, 60, f"Writer · {nm}", hue="olake", glyph="write")
        tb = p.tablecard(1290, y, 244, 60, f"{nm} table")
        p.edge(rd, wr, exit=(1, 0.5), entry=(0, 0.5))
        p.edge(wr, tb, kind="commit", exit=(1, 0.5), entry=(0, 0.5))
    p.text(706, 400, 220, "more readers would not help: the log is one ordered sequence",
           size=10.5)
    p.caption("One database, one ordered log. A single reader tails it, decodes each event, and routes it to "
              "that stream's own writer and table.")
    return p


def p05():
    p = cdc_page("p05", "05", "Concurrent CDC: a change feed per stream",
                 "MongoDB · SQL Server — each stream starts the moment its own full load finishes",
                 "concurrent", h=740)
    db = p.sourcedb(56, 238, 210, 218, "MongoDB", "mongodb", "or SQL Server",
                    streams=["shop.orders", "shop.users"],
                    stream_label="the collections being synced")
    for nm, y, cells in [("orders", 180, ["K1:I", "K2:U", "K7:D"]),
                         ("users", 430, ["K3:U", "K9:I", "K4:U"])]:
        p.logtape(340, y + 14, cells, cw=60, tail=False,
                  label=f"{nm} — its own change feed")
        rd = p.component(700, y, 190, 62, f"Reader · {nm}", hue="olake", glyph="log")
        wr = p.component(990, y, 190, 62, f"Writer · {nm}", hue="olake", glyph="write")
        tb = p.tablecard(1290, y, 244, 62, f"{nm} table")
        p.edge(None, None, pa=(268, 318 if y < 300 else 372), pb=(334, y + 45))
        p.edge(None, rd, pa=(530, y + 45), entry=(0, 0.5))
        p.edge(rd, wr, exit=(1, 0.5), entry=(0, 0.5))
        p.edge(wr, tb, kind="commit", exit=(1, 0.5), entry=(0, 0.5))
    p.edge(None, None, pa=(340, 352), pb=(1534, 352), kind="faint", arrow=False)
    p.text(640, 322, 560, "independent — neither stream waits on the other", size=10.5)
    p.caption("Every stream gets its own feed, reader, and writer, so each switches from full load to change "
              "capture on its own schedule instead of waiting for its neighbours.")
    return p


def p06():
    p = page("p06", "06 · CDC — parallel (Kafka)", 1720, 780)
    p.title("Parallel CDC: partitions fan out, topics converge",
            "Apache Kafka — partitions are independent, so readers consume them simultaneously")
    kf = p.sourcedb(56, 288, 210, 218, "Apache Kafka", "apachekafka", "2 topics × 2 partitions",
                    streams=["topic 1", "topic 2"], stream_label="the topics being synced")
    parts = [("topic 1 · partition 0", 176, ["41", "42", "43"]),
             ("topic 2 · partition 0", 268, ["17", "18", "19"]),
             ("topic 1 · partition 1", 536, ["88", "89", "90"]),
             ("topic 2 · partition 1", 628, ["04", "05", "06"])]
    pid_ = []
    for t, y, offs in parts:
        pid_.append(p.logtape(330, y, offs, w=168, cw=56, tail=False, label=t))
    p.zone(618, 150, 288, 570, "Consumer group", "offsets committed after the destination",
           hue="olake")
    r1 = p.component(650, 216, 222, 62, "Reader 1", hue="olake", on_wash=True, glyph="log")
    r2 = p.component(650, 576, 222, 62, "Reader 2", hue="olake", on_wash=True, glyph="log")
    for i, q in enumerate(pid_):
        p.edge(kf, q, exit=(1, 0.5), entry=(0, 0.5))
        p.edge(q, r1 if i < 2 else r2, exit=(1, 0.5), entry=(0, 0.5))
    p.text(636, 400, 252, "partitions are balanced across the readers in the group", size=10.5)
    wids = []
    for t, y, r in [("topic 1", 176, r1), ("topic 2", 268, r1),
                    ("topic 1", 536, r2), ("topic 2", 628, r2)]:
        w = p.component(986, y, 210, 54, f"Writer · {t}", hue="olake", glyph="write")
        p.edge(r, w, exit=(1, 0.5), entry=(0, 0.5))
        wids.append(w)
    t1 = p.tablecard(1370, 310, 250, 66, "topic 1 table")
    t2 = p.tablecard(1370, 470, 250, 66, "topic 2 table")
    for w, tb, e in [(wids[0], t1, 0.3), (wids[2], t1, 0.72), (wids[1], t2, 0.3),
                     (wids[3], t2, 0.72)]:
        p.edge(w, tb, kind="commit", exit=(1, 0.5), entry=(0, e))
    p.caption("Each reader creates its own writer per topic — four writers here. Whichever reader consumed "
              "the partition, a topic's records always land in that topic's table.")
    return p


# ============================================================ 07 handoff
def p07():
    p = page("p07", "07 · Full load → CDC handoff", 1720, 620)
    p.title("The handoff: pin the log first, load, then replay",
            "nothing that changes during the load is lost, and nothing lands twice")
    BY = 400
    xs = [180, 508, 836, 1164, 1492]
    ow = HUE["amber"]
    p.cell("", f"rounded=1;absoluteArcSize=1;arcSize=8;html=1;fillColor={ow[1]};"
               f"strokeColor={ow[0]};strokeWidth=1.4;dashed=1;dashPattern=6 4;",
           800, BY - 17, 528, 34)
    p.r(800, BY - 17, 528, 34, ow[1], ow[0], 1.4, rx=8, dash=True)
    p.text(864, BY - 46, 400, "overlap window — inserts deduplicated", size=10.8,
           color=ow[3], bold=True)
    gw = HUE["green"]
    p.cell("", f"rounded=1;absoluteArcSize=1;arcSize=8;html=1;fillColor={gw[1]};"
               f"strokeColor=none;", 1336, BY - 17, 330, 34)
    p.r(1336, BY - 17, 330, 34, gw[1], "none", 0, rx=8)
    p.text(1360, BY - 46, 300, "steady state — plain appends", size=10.8, color=gw[3], bold=True)
    p.edge(None, None, pa=(90, BY), pb=(1670, BY), sw=2.4)
    labels = [("PreCDC pins the position", "LSN · binlog coords · resume token"),
              ("Chunked full load", "parallel, resumable"),
              ("Replay from the pin", "every mid-load change arrives"),
              ("Overlap window", "insert → op i → upsert"),
              ("Steady state", "insert → op c → append")]
    for i, (x, (t, s)) in enumerate(zip(xs, labels)):
        p.disc(x, BY, i + 1)
        p.text(x - 150, BY + 34, 300, t, size=13.5, color=INK, bold=True, h=20)
        p.text(x - 150, BY + 57, 300, s, size=11, h=18)
    p.logtape(96, 232, ["K1:I", "K2:U", ""], cw=56, pin=0.66, pin_label="pinned here")
    for j, s in enumerate(["done", "done", "inflight", "pending"]):
        p.chunk(424 + j * 44, 246, s, "", w=40, h=26)
    p.text(404, 288, 200, "chunks run", size=10.4, h=16)
    p.logtape(756, 232, ["K1:I", "K2:U", "K9:I"], cw=56, pin=0.02, mark={2: "amber"})
    p.text(748, 288, 200, "replayed from ⚑", size=10.4, h=16)
    p.chip(1092, 240, 76, 30, "op i", hue="amber")
    p.chip(1180, 240, 92, 30, "upsert", hue="white")
    p.chip(1420, 240, 76, 30, "op c", hue="white")
    p.chip(1508, 240, 92, 30, "append", hue="green")
    p.caption("PreCDC pins the log position before any data moves (1), the chunked load runs (2), and the log "
              "replays from exactly that pin (3). Until the first CDC session commits, inserts are tagged i and "
              "land as upserts (4); after that they append as plain c (5).")
    return p


# ============================================================ 08 worked example
def p08():
    p = page("p08", "08 · Worked example — row 2 lands once", 1720, 800)
    p.title("Worked example: a row inserted mid-load lands exactly once",
            "Bob is inserted after the log is pinned but before his chunk runs — so both paths see him")
    src = p.datatable(56, 190, ["id", "customer", "amount"],
                      [["1", "Alice", "120.00"],
                       ["2", "Bob", "340.00"],
                       ["3", "Dan", "90.00"]],
                      [50, 108, 92], title="public.orders  (source)", mono_cols=(0, 2),
                      mark={1: "amber"})
    p.text(56, 320, 250, "row 2 is inserted at 09:02 — after PreCDC pinned the log ⚑, "
                         "before chunk 1 runs", size=10.4, color=HUE["amber"][3], align="left")
    p.zone(390, 150, 560, 150, "Backfill path", "reads whatever is committed right now")
    p.disc(390, 172, 1)
    bf = p.component(420, 208, 250, 62, "Chunk scan", "SELECT … WHERE ctid < (10,0)",
                     hue="olake", on_wash=True, mono_sub=True)
    r1 = p.chip(710, 224, 210, 32, "id 2 · Bob · op r", hue="white", mono=True)
    p.edge(bf, r1, exit=(1, 0.5), entry=(0, 0.5))
    p.zone(390, 360, 560, 178, "CDC replay path", "replays from the pinned position", hue="amber")
    p.disc(390, 382, 2)
    p.logtape(420, 420, ["K1:I", "K2:I", "K3:U"], cw=58, mark={1: "amber"},
              label="the same insert, replayed")
    cdc = p.chip(710, 430, 210, 32, "id 2 · Bob · op i", hue="amber", mono=True)
    p.edge(None, cdc, pa=(614, 446), entry=(0, 0.5))
    p.edge(None, None, pa=(230, 270), pb=(384, 250))
    p.edge(None, None, pa=(230, 290), pb=(384, 440))
    wr = p.component(1010, 288, 230, 90, "Writer", "both hash to the same _olake_id",
                     hue="olake")
    p.edge(r1, wr, exit=(1, 0.5), entry=(0, 0.3))
    p.edge(cdc, wr, exit=(1, 0.5), entry=(0, 0.75))
    led = p.node(1010, 420, 230, 56, "olake_2pc", "dedup_inserts = true", hue="amber",
                 tsize=12, mono_sub=True)
    p.edge(wr, led, kind="meta", exit=(0.5, 1), entry=(0.5, 0), both=True, label="checks")
    p.disc(998, 272, 3)
    f1 = p.filenote(1310, 168, 168, 84, "equality delete", "_olake_id", "= hash(2)", hue="white")
    f2 = p.filenote(1508, 168, 168, 84, "data file", "id 2 · Bob", "op `c`", hue="white")
    p.edge(wr, f1, exit=(1, 0.25), entry=(0, 0.5))
    p.edge(wr, f2, exit=(0.9, 0), points=[(1217, 136), (1592, 136)], entry=(0.5, 0))
    cm = p.node(1330, 320, 334, 62, "One Iceberg commit", "delete + data — all, or nothing",
                hue="green", tsize=12.5)
    p.disc(1330, 320, 4)
    p.edge(f1, cm, kind="commit", exit=(0.5, 1), entry=(0.22, 0))
    p.edge(f2, cm, kind="commit", exit=(0.5, 1), entry=(0.78, 0))
    dst = p.datatable(1334, 470, ["_olake_id", "id", "customer", "_op_type"],
                      [["a3f1…", "1", "Alice", "r"],
                       ["b7c2…", "2", "Bob", "c"],
                       ["e91d…", "3", "Dan", "r"]],
                      [92, 44, 100, 90], title="destination table  (result)", hue="green",
                      mono_cols=(0, 1, 3), mark={1: "green"},
                      note="one row for id 2 — not two")
    p.edge(cm, dst, kind="commit", exit=(0.5, 1), pb=(1497, 470))
    p.caption("The backfill writes Bob as a plain append (op r) and the replay hands him over again inside the "
              "overlap window (op i). Because both hash to the same _olake_id, the writer emits an equality "
              "delete plus a fresh data file, one commit applies both, and the table ends with a single row 2.")
    return p


# ============================================================ 09 record anatomy
def p09():
    p = page("p09", "09 · What a record carries", 1720, 720)
    p.title("Every record carries its own provenance",
            "OLake stamps four metadata columns onto each row, plus the exact log position for CDC")
    p.datatable(56, 156, ["id", "customer", "amount", "updated_at"],
                [["2", "Bob", "340.00", "09:02:11"]],
                [50, 100, 90, 110], title="source row, as the database has it",
                mono_cols=(0, 2, 3))
    p.edge(None, None, pa=(420, 183), pb=(516, 183), label="stamp", loff=-16)
    p.datatable(540, 156, ["_olake_id", "_op_type", "_olake_timestamp", "_cdc_timestamp"],
                [["b7c2…", "c", "09:02:14", "09:02:11"]],
                [96, 88, 140, 130], title="the same row, as OLake moves it", hue="amber",
                mono_cols=(0, 1, 2, 3))
    p.datatable(1130, 156, ["_cdc_lsn"], [["0/1A2B3C4D"]], [150],
                title="plus the source's own position", hue="ext", mono_cols=(0,))
    p.text(1130, 244, 460, "one column per source: MySQL writes binlog file and position, "
                           "MongoDB a resume token, Kafka partition and offset",
           size=10.6, align="left")
    p.text(56, 250, 1000, "_olake_id is a hash of the primary key — the identity the destination "
                          "deduplicates and upserts on. _op_type is how the writer knows what to do "
                          "with the row.", size=11.5, align="left")
    p.caption("Because the operation type travels with the record, the writer never has to guess: r and c "
              "append, u and d delete by _olake_id, and i is the one that makes the full-load-to-CDC overlap "
              "safe to replay.")
    p.datatable(56, 356, ["_op_type", "emitted by", "meaning", "how it lands"],
                [["r", "full load", "row read during a backfill scan", "plain append"],
                 ["c", "CDC", "insert captured from the change log", "plain append"],
                 ["i", "CDC", "insert that may duplicate a backfilled row",
                  "equality delete + insert"],
                 ["u", "CDC · incremental", "new version of an existing row",
                  "equality delete + insert"],
                 ["d", "CDC", "delete captured from the change log", "equality delete"]],
                [96, 168, 400, 250], title="the five operation types", hue="olake",
                mono_cols=(0,), mark={2: "amber"})
    p.node(1080, 356, 320, 74, "`i` only exists in the overlap window",
           "once it closes, inserts arrive as plain `c`", hue="amber", tsize=12.5)
    p.node(1080, 448, 320, 74, "Incremental never emits `d`",
           "a row deleted at the source just stops appearing", hue="ext", tsize=12.5)
    p.node(1080, 540, 320, 74, "CDC has no such gap",
           "a delete is a real event on the change log", hue="ext", tsize=12.5)
    p.text(1440, 356, 224, "This is why the destination never has to diff anything: the record "
                           "already says what it is.", size=11, align="left")
    return p


# ============================================================ 10 exactly-once
def p10():
    p = page("p10", "10 · Exactly-once — the table is the ledger", 1720, 680)
    p.title("Exactly-once delivery with no coordinator",
            "each commit writes the data and the record of the data, in one Iceberg transaction")
    p.zone(56, 140, 372, 440, "One Iceberg transaction", "staged together, visible together",
           hue="green")
    p.filenote(96, 202, 284, 92, "Data files", "new rows, Iceberg-compliant", "Parquet",
               hue="white", stack=True)
    p.filenote(96, 320, 284, 92, "Delete files", "equality deletes", "positional deletes",
               hue="white", stack=True)
    p.node(96, 438, 284, 86, "olake_2pc", "committed thread IDs · last log",
           "position · dedup_inserts", hue="amber", tsize=12.5, glyph="state")
    p.text(96, 534, 284, "all three become visible together, or none of them at all",
           size=10.8, italic=True)
    p.zone(700, 150, 440, 260, "Iceberg table", "all-or-nothing", hue="green")
    p.tablecard(732, 216, 376, 62, "committed data", "queryable the moment the swap lands")
    p.node(732, 300, 376, 62, "olake_2pc", "the ledger, inside the table itself", hue="amber",
           on_wash=True, tsize=12.5, glyph="lock")
    p.edge(None, None, pa=(434, 300), pb=(694, 288), kind="commit", label="single atomic swap",
           lx=562, ly=276)
    nx = p.component(700, 500, 240, 74, "Next sync run", "opens the table first", hue="olake",
                     glyph="search")
    sk = p.component(1030, 500, 300, 74, "Skips committed work",
                     "chunk IDs and positions already done", hue="olake", glyph="commit")
    p.edge(None, nx, kind="meta", pa=(870, 366), points=[(820, 456)], entry=(0.5, 0),
           label="reads olake_2pc before doing anything", lx=1040, ly=430)
    p.edge(nx, sk, exit=(1, 0.5), entry=(0, 0.5))
    p.text(1200, 216, 400, "No external coordinator and no transaction log of its own: the "
                           "committed table is the only thing OLake trusts on restart. If the "
                           "table is ahead of state.json, the table wins.",
           size=11.5, align="left")
    p.caption("Every recovery path asks the destination the same question before it starts: what did you last "
              "durably record? Trusting the committed table over the local state file is what lets a plain "
              "stateless binary promise exactly-once.")
    return p


# ============================================================ 11 write path
def p11():
    p = page("p11", "11 · The write path", 1720, 660)
    p.title("Two runtimes, one destination",
            "the hot data path stays in Go; catalogs and commits use the official Iceberg Java library")
    p.zone(56, 140, 500, 420, "Go process", "the data path", hue="olake")
    p.icon("go", 480, 166, 40)
    g = [("Arrow record batches", "readers push · buffers flush at 10 000", "buffer"),
         ("Iceberg-compliant Parquet", "correct field IDs · partition-aware", "file"),
         ("Rolling writers", "data 512 MB · delete 64 MB · per partition", "chunks")]
    gid = [p.component(94, 214 + i * 108, 424, 74, t, s, hue="olake", on_wash=True, glyph=gl)
           for i, (t, s, gl) in enumerate(g)]
    p.edge(gid[0], gid[1], exit=(0.5, 1), entry=(0.5, 0))
    p.edge(gid[1], gid[2], exit=(0.5, 1), entry=(0.5, 0))
    p.zone(750, 140, 500, 420, "Shared JVM sidecar", "catalog & commit", hue="olake")
    p.icon("java", 1174, 166, 40)
    j = [("Apache Iceberg Java library", "the official implementation", "commit"),
         ("Create · load · evolve · drop", "typed gRPC requests", "schema"),
         ("REGISTER_AND_COMMIT", "one Iceberg transaction per writer", "lock")]
    jid = [p.component(788, 214 + i * 108, 424, 74, t, s,
                       hue="green" if i == 2 else "olake", on_wash=True, glyph=gl)
           for i, (t, s, gl) in enumerate(j)]
    p.edge(jid[0], jid[1], exit=(0.5, 1), entry=(0.5, 0))
    p.edge(jid[1], jid[2], exit=(0.5, 1), entry=(0.5, 0))
    p.edge(None, None, pa=(562, 350), pb=(744, 350), both=True)
    p.text(566, 300, 174, "gRPC on localhost — finished files as bytes", size=10.5)
    p.bucket(1340, 170, 210, 140, "Object store", "Parquet files")
    p.cylinder(1340, 388, 210, 130, "Catalog", "Glue · Hive · JDBC · REST", hue="ext",
               tsize=12.5, glyph="search")
    p.edge(None, None, pa=(1256, 262), pb=(1334, 240), kind="commit", label="place files",
           lx=1296, ly=228)
    p.edge(None, None, pa=(1256, 442), pb=(1334, 452), label="commit", lx=1296, ly=430)
    p.caption("With arrow_writes enabled the Go process serializes batches straight to Iceberg-compliant "
              "Parquet and ships finished files over local gRPC; the JVM only registers them and commits, so "
              "no records cross the boundary one at a time.")
    return p


# ============================================================ 00 design language
def p00():
    p = page("p00", "00 · Design language", 1720, 1210)
    p.title("OLake diagram design language",
            "one vocabulary for every architecture diagram — a shape or colour means the same thing on every page")
    p.sectionlabel(56, 96, "COLOUR · five meanings, never decoration")
    sw = [("OLake compute", "engine · readers · writers · workers", "olake"),
          ("External system", "source databases · logs · catalogs", "ext"),
          ("Durable / committed", "Iceberg tables · atomic commits", "green"),
          ("State & bookkeeping", "state.json · olake_2pc · pins", "amber"),
          ("Failure & retry", "errors · backoff — used sparingly", "rose")]
    for i, (t, s, k) in enumerate(sw):
        p.node(56 + i * 330, 126, 306, 76, t, s, hue=k)
    p.sectionlabel(56, 226, "COMPONENTS · reuse these, never redraw them")
    p.cylinder(56, 264, 168, 120, "PostgreSQL", "source system", ic="postgresql")
    p.text(56, 390, 168, "any store: source DB, catalog", size=10.4, h=16)
    p.vendor(252, 302, 176, 44, "MongoDB", "mongodb")
    p.text(252, 390, 176, "vendor card (lists only)", size=10.4, h=16)
    p.component(470, 296, 186, 56, "Reader", "OLake process", glyph="log")
    p.text(462, 390, 200, "UML component", size=10.4, h=16)
    p.logtape(700, 306, ["K1:I", "K2:U", "K3:D"], cw=54, pin=0.62)
    p.text(690, 390, 200, "change log + pin", size=10.4, h=16)
    p.filenote(940, 292, 150, 66, "state.json", "chunk lists", hue="amber")
    p.text(936, 390, 158, "state file", size=10.4, h=16)
    p.filenote(1128, 296, 140, 62, "data file", "Parquet", hue="white", stack=True)
    p.text(1118, 390, 160, "file · stacked = many", size=10.4, h=16)
    p.tablecard(1310, 296, 226, 62, "orders table")
    p.text(1310, 390, 226, "destination table", size=10.4, h=16)
    p.bucket(1570, 264, 120, 116, "Object store", "S3")
    p.text(1560, 390, 140, "object storage", size=10.4, h=16)
    y2 = 424
    for j, (s, t) in enumerate([("pending", "pending"), ("inflight", "in flight"),
                                ("done", "committed"), ("retry", "retrying")]):
        p.chunk(56 + j * 108, y2, s, "(0,1)–(4,0)" if s == "pending" else "", w=98, h=28, tsize=9)
        p.text(50 + j * 108, y2 + 34, 110, t, size=10, h=16)
    p.text(56, y2 + 56, 420, "chunk — the unit of parallelism, retry and resume", size=10.4,
           align="left", h=16)
    p.chip(510, y2, 150, 30, "id 2 · op r", hue="white", mono=True)
    p.chip(676, y2, 150, 30, "id 2 · op i", hue="amber", mono=True)
    p.text(510, y2 + 36, 316, "record chip — the op type travels with the row", size=10.4, h=16)
    p.disc(880, y2 + 15, 1)
    p.text(850, y2 + 36, 62, "step", size=10.4, h=16)
    p.badge(950, y2 + 15, "↻", "rose")
    p.badge(994, y2 + 15, "⚑", "amber")
    p.badge(1038, y2 + 15, "✓", "green")
    p.text(920, y2 + 36, 150, "retry · pin · done", size=10.4, h=16)
    p.chip(1120, y2, 116, 30, "12 streams")
    p.edge(None, None, pa=(1240, y2 + 15), pb=(1286, y2 + 15))
    p.chip(1290, y2, 110, 30, "4 selected")
    p.text(1120, y2 + 36, 280, "selection — fewer leave than entered (never a funnel)",
           size=10.4, h=16)
    p.zone(1440, y2 + 6, 224, 74, "Zone", "one runtime or plane")
    p.sectionlabel(56, 512, "GLYPH TEMPLATE · pick from these, don't invent a new icon")
    gl = [("classify", "classify"), ("chunks", "chunk / split"), ("types", "type convert"),
          ("state", "state file"), ("buffer", "buffer / batch"), ("schema", "schema evolve"),
          ("commit", "commit"), ("lock", "atomic"), ("retry", "retry"), ("pin", "pinned"),
          ("log", "change log"), ("parallel", "parallel"), ("dial", "limits"),
          ("write", "writer"), ("handoff", "handoff"), ("clock", "timing"),
          ("search", "discover"), ("table", "table"), ("delete", "delete")]
    for i, (g, lab) in enumerate(gl):
        gx = 56 + i * 87
        p.glyph(g, gx + 18, 546, 30, HUE["olake"][0])
        p.text(gx - 8, 580, 80, lab, size=9.4, h=14)
    p.text(56, 604, 900, "one glyph per concept, 24 px, in the hue of the block it sits in — "
                         "the same set is in the shape library", size=10.4, align="left")

    p.sectionlabel(56, 646, "INTERFACES · HLD notation for the code-shaped parts")
    p.interface(56, 684, 330, "DriverInterface",
                [("full load", ["GetOrSplitChunks()", "ChunkIterator()"])])
    p.lollipop(470, 736, hue="olake")
    p.edge(None, None, pa=(430, 736), pb=(461, 736), arrow=False, sw=2)
    p.text(420, 762, 130, "provided", size=10, h=14)
    p.socket(560, 736, hue="olake")
    p.edge(None, None, pa=(575, 736), pb=(620, 736), arrow=False, sw=2)
    p.text(516, 762, 130, "required", size=10, h=14)
    p.text(56, 826, 560, "an interface box lists real method names with (); a ball means "
                         "“implements” and a socket means “uses”", size=10.4,
           align="left")
    p.sectionlabel(700, 646, "TABLES · always show real rows")
    p.datatable(700, 684, ["id", "customer", "_op_type"],
                [["1", "Alice", "r"], ["2", "Bob", "c"]], [50, 104, 90], hue="green",
                mono_cols=(0, 2), mark={1: "green"})
    p.text(700, 768, 300, "a worked example beats an abstract box", size=10.4, align="left")
    p.sectionlabel(1060, 646, "EDGES · line style is meaning")
    ey = 690
    for i, (k, lab) in enumerate([("data", "data flow — solid slate"),
                                  ("meta", "state & metadata — dashed amber"),
                                  ("commit", "atomic commit — bold green"),
                                  ("error", "failure path — red, sparingly")]):
        p.edge(None, None, pa=(1060, ey + i * 34), pb=(1240, ey + i * 34), kind=k)
        p.text(1256, ey + i * 34 - 10, 400, lab, size=11, align="left", h=20)
    p.sectionlabel(56, 896, "TYPE · one family, four sizes")
    p.text(56, 924, 500, "Page title — 21 bold", size=21, color=INK, bold=True, align="left", h=30)
    p.text(56, 958, 500, "Node name — 13 bold", size=13, color=INK, bold=True, align="left", h=20)
    p.text(56, 982, 500, "Secondary detail — 11 slate", size=11, align="left", h=18)
    p.text(56, 1004, 500, "GetOrSplitChunks() — 11 mono for code", size=11, align="left",
           mono=True, h=18)
    p.sectionlabel(700, 896, "RULES")
    rules = [
        "1  One meaning per shape and colour — on every page, without exception.",
        "2  Flow reads left → right; stacks read top → bottom. Never both at once.",
        "3  Solid = data, dashed amber = state, bold green = commit. Label arrows with verbs.",
        "4  Real values in every shape: ctid ranges, LSNs, id 2 · Bob. Never lorem boxes.",
        "5  Vendor marks identify systems; the shape still carries the meaning.",
        "6  ≤ 12 primary nodes per page. Split rather than shrink the type.",
        "7  Every page: a title, one-sentence caption, and numbered steps if order matters.",
        "8  A new concept gets its symbol added to this page first.",
    ]
    for i, r in enumerate(rules):
        p.text(700, 926 + i * 26, 980, r, size=11.5, color=INK, align="left", h=20)
    p.caption("Edit freely — this page is the contract every other page keeps.", y=1150)
    return p


# ---------------------------------------------------------------- library
def make_library():
    entries = []

    def entry(title, build, w, h):
        q = Pg("lib", title, w, h)
        build(q)
        entries.append({"xml": '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
                               + "".join(q.cells) + "</root></mxGraphModel>",
                        "w": w, "h": h, "aspect": "fixed", "title": title})

    entry("Source system", lambda q: q.cylinder(0, 0, 176, 104, "PostgreSQL", "one database",
                                                ic="postgresql"), 176, 104)
    entry("Vendor card", lambda q: q.vendor(0, 0, 210, 44, "MongoDB", "mongodb"), 210, 44)
    entry("Component (OLake)", lambda q: q.component(8, 0, 182, 56, "Reader", "one per stream"), 190, 56)
    entry("Component (on zone wash)", lambda q: q.component(8, 0, 182, 56, "Writer", "one per reader",
                                                            on_wash=True), 190, 56)
    entry("Zone container", lambda q: q.zone(0, 16, 300, 150, "Sync engine", "shared", hue="olake"), 300, 170)
    entry("Interface box", lambda q: q.interface(0, 0, 320, "DriverInterface",
          [("full load", ["GetOrSplitChunks()", "ChunkIterator()"])]), 320, 130)
    entry("Lollipop (provides)", lambda q: q.lollipop(12, 12), 24, 24)
    entry("Socket (requires)", lambda q: q.socket(16, 16), 32, 32)
    entry("Data table", lambda q: q.datatable(0, 0, ["id", "customer", "_op_type"],
          [["1", "Alice", "r"], ["2", "Bob", "c"]], [50, 104, 90], hue="green",
          mono_cols=(0, 2), mark={1: "green"}), 244, 77)
    entry("Change log tape", lambda q: q.logtape(0, 14, ["K1:I", "K2:U", "K3:D"], cw=54,
                                                 pin=0.62), 184, 62)
    entry("State file", lambda q: q.filenote(0, 0, 170, 66, "state.json", "chunk lists · cursors"), 170, 66)
    entry("Data files (stacked)", lambda q: q.filenote(0, 10, 150, 62, "data files", "Parquet",
                                                       hue="white", stack=True), 160, 72)
    entry("Destination table", lambda q: q.node(0, 0, 220, 60, "orders table", "Iceberg",
                                                hue="green"), 220, 60)
    entry("Object store", lambda q: q.bucket(0, 0, 190, 124, "Object store", "Parquet files"), 190, 124)
    for st, lab in [("pending", "pending"), ("inflight", "in flight"), ("done", "committed"),
                    ("retry", "retrying")]:
        entry(f"Chunk — {lab}", (lambda s: lambda q: q.chunk(0, 0, s, "(0,1)–(4,0)", w=98,
                                                             h=28, tsize=9))(st), 98, 28)
    entry("Record chip", lambda q: q.chip(0, 0, 150, 30, "id 2 · op r", mono=True), 150, 30)
    entry("Record chip (overlap)", lambda q: q.chip(0, 0, 150, 30, "id 2 · op i", hue="amber",
                                                    mono=True), 150, 30)
    entry("Step number", lambda q: q.disc(14, 14, 1), 28, 28)
    for gl, hue, nm in [("↻", "rose", "retry"), ("⚑", "amber", "pin"), ("✓", "green", "done")]:
        entry(f"Badge — {nm}", (lambda g, h: lambda q: q.badge(12, 12, g, h))(gl, hue), 24, 24)
    for k, nm in [("data", "data flow"), ("meta", "state / metadata"),
                  ("commit", "atomic commit"), ("error", "failure path")]:
        entry(f"Edge — {nm}", (lambda kk: lambda q: q.edge(None, None, pa=(0, 20), pb=(180, 20),
                                                           kind=kk))(k), 180, 40)
    for nm in sorted(ICONS):
        entry(f"Mark — {nm}", (lambda n: lambda q: q.icon(n, 0, 0, 32))(nm), 32, 32)
    return "<mxlibrary>" + json.dumps(entries) + "</mxlibrary>"


def main():
    for fn in (p00, p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11):
        fn()
    doc = ('<mxfile host="app.diagrams.net" agent="olake-diagram-gen" version="24.7.17">'
           + "".join(pg.drawio() for pg in PAGES) + "</mxfile>")
    open(os.path.join(OUT, "olake-architecture.drawio"), "w").write(doc)
    open(os.path.join(OUT, "olake-shape-library.xml"), "w").write(make_library())
    for pg in PAGES:
        pg.write_svg()
    print("pages:", ", ".join(pg.pid for pg in PAGES))


if __name__ == "__main__":
    main()
