#!/usr/bin/env python3
"""Build icons.json: vendor marks as (viewBox, inner SVG, base64 data URI).

Sources: simple-icons (CC0) for Postgres/MySQL/Mongo/Kafka/Parquet/Go/OpenJDK,
devicon for Oracle/SQL Server, hand-authored marks for Db2, S3 and Iceberg.
Both consumers use the same data: draw.io gets `image=data:image/svg+xml,<b64>`,
the SVG preview inlines `inner` inside a scaled <g>.
"""
import base64
import json
import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ICONS = {}


def add(name, viewbox, inner, hex_):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">{inner}</svg>')
    ICONS[name] = {
        "vb": [float(v) for v in viewbox.split()],
        "inner": inner,
        "b64": base64.b64encode(svg.encode()).decode(),
        "hex": hex_,
    }


# ---- simple-icons (single path, 24x24) -------------------------------------
SI = {"postgresql": "#336791", "mysql": "#00758F", "mongodb": "#47A248",
      "apachekafka": "#231F20", "apacheparquet": "#50ABF1", "go": "#00ADD8"}
js = "const si=require('simple-icons');const o={};" + "".join(
    f"o['{k}']=si.si{k[0].upper()}{k[1:]}.path;" for k in SI) + "console.log(JSON.stringify(o));"
paths = json.loads(subprocess.run(["node", "-e", js], cwd=HERE, capture_output=True,
                                  text=True, check=True).stdout)
for k, hexv in SI.items():
    add(k, "0 0 24 24", f'<path d="{paths[k]}" fill="{hexv}"/>', hexv)

# ---- devicon (multi-path, keep as-is) --------------------------------------
for name, rel, hexv in [("oracle", "oracle/oracle-original.svg", "#EA1B22"),
                        ("sqlserver", "microsoftsqlserver/microsoftsqlserver-plain.svg", "#CC2927")]:
    src = open(os.path.join(HERE, "node_modules/devicon/icons", rel)).read()
    vb = re.search(r'viewBox="([^"]+)"', src).group(1)
    inner = re.sub(r"^.*?<svg[^>]*>|</svg>\s*$", "", src, flags=re.S).strip()
    inner = re.sub(r"<(\?xml|!DOCTYPE)[^>]*>", "", inner)
    add(name, vb, inner, hexv)

# ---- hand-authored marks ---------------------------------------------------
# IBM Db2: the IBM eight-stripe wordmark idea, reduced to legible stripes.
add("db2", "0 0 24 24",
    "".join(f'<rect x="{2 + (0.9 if i in (1, 6) else 0)}" y="{5.4 + i * 1.75}" '
            f'width="{20 - (1.8 if i in (1, 6) else 0)}" height="1.15" rx=".3" '
            f'fill="#052FAD"/>' for i in range(8)),
    "#052FAD")

# Amazon S3: the bucket, which is the conventional metaphor anyway.
add("s3", "0 0 24 24",
    '<path d="M3.2 5.2h17.6l-1.9 14.2a1.6 1.6 0 0 1-1.6 1.4H6.7a1.6 1.6 0 0 1-1.6-1.4z" '
    'fill="#7AA116"/><ellipse cx="12" cy="5.2" rx="8.8" ry="1.9" fill="#95C623"/>'
    '<path d="M9.4 9.6l1 8.2M14.6 9.6l-1 8.2" stroke="#FFF" stroke-width="1.1" '
    'stroke-linecap="round" opacity=".85"/>',
    "#7AA116")

# Apache Iceberg: the small peak above the waterline, the mass below it.
add("iceberg", "0 0 24 24",
    '<path d="M12 2.6l5.4 8.1H6.6z" fill="#5AD0E6"/>'
    '<path d="M12 2.6l5.4 8.1H12z" fill="#1B9CC4"/>'
    '<path d="M2.9 11.9h18.2l-4.5 6.3-4.7 3.4-3.6-4.3z" fill="#2F6EA8"/>'
    '<path d="M12 11.9h9.1l-4.5 6.3-4.6 3.4z" fill="#24527D"/>'
    '<path d="M1.6 11.2h20.8" stroke="#9FE0EE" stroke-width="1.4" stroke-linecap="round"/>',
    "#1B9CC4")

# Java runtime: the cup, for the JVM sidecar.
add("java", "0 0 24 24",
    '<path d="M6.6 15.4h10.8c.6 0 1 .5.9 1.1l-.5 3.1a2 2 0 0 1-2 1.7H8.2a2 2 0 0 1-2-1.7l-.5-3.1'
    'c-.1-.6.3-1.1.9-1.1z" fill="#E76F00"/>'
    '<path d="M17.8 16.4h1.3a1.9 1.9 0 0 1 0 3.8h-1.7" fill="none" stroke="#E76F00" stroke-width="1.4"/>'
    '<path d="M10.4 3.2c2.4 2 .6 3.2-.3 4.4-.9 1.2-.4 2.3 1.4 3.3-2.9-.8-4.1-2.2-3.2-3.7.7-1.2 2.6-2.1 2.1-4z'
    'M14 6.4c1.6 1.4.3 2.5-.6 3.4-.7.7-.5 1.3.4 1.9-2-.6-2.7-1.6-1.9-2.6.6-.8 2-1.5 2.1-2.7z" fill="#5382A1"/>',
    "#E76F00")

with open(os.path.join(HERE, "icons.json"), "w") as f:
    json.dump(ICONS, f)
print("icons:", ", ".join(sorted(ICONS)))
print("bytes:", os.path.getsize(os.path.join(HERE, "icons.json")))
