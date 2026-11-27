"""Print Debezium change events (JSON converter, schemas off) one per block, short enough to read.

Reads one event value per line on stdin, as kafka-console-consumer.sh prints them. A value of 40
characters or fewer is shown as it is. A longer one is shown by its length. A bytea value that
decodes to text is shown decoded as well, so a placeholder in a binary column can be read.
With --raw FILE, each event is also written to FILE with every value over 200 characters cut to
its first 60 characters plus its length.
"""
import base64
import json
import re
import sys

OPS = {"r": "read (snapshot)", "c": "create", "u": "update", "d": "delete"}


def short(value):
    if value is None:
        return "null"
    if isinstance(value, list):
        if len(json.dumps(value)) <= 40:
            return json.dumps(value)
        return "<array of %d>" % len(value)
    text = value if isinstance(value, str) else json.dumps(value)
    if len(text) <= 40:
        shown = json.dumps(text) if isinstance(value, str) else text
    else:
        shown = "<%d chars>" % len(text)
    if isinstance(value, str) and len(text) <= 60 and len(text) % 4 == 0 and re.fullmatch(r"[A-Za-z0-9+/]+={0,2}", text):
        try:
            decoded = base64.b64decode(text, validate=True).decode("ascii")
            if decoded.isprintable():
                shown += "  (base64 of %s)" % json.dumps(decoded)
        except (ValueError, UnicodeDecodeError):
            pass
    return shown


def cut(value):
    if isinstance(value, str) and len(value) > 200:
        return "%s...(%d chars)" % (value[:60], len(value))
    if isinstance(value, list):
        text = json.dumps(value)
        return "%s...(array of %d, %d chars)" % (text[:60], len(value), len(text)) if len(text) > 200 else value
    if isinstance(value, dict):
        return {k: cut(v) for k, v in value.items()}
    return value


raw = None
if len(sys.argv) == 3 and sys.argv[1] == "--raw":
    raw = open(sys.argv[2], "a")

count = 0
for line in sys.stdin:
    line = line.strip()
    if not line.startswith("{"):
        if line == "null":
            print("(tombstone)")
        continue
    event = json.loads(line)
    event = event.get("payload", event)
    count += 1
    if raw:
        raw.write(json.dumps(cut(event)) + "\n")
    print("op=%s  %s" % (event.get("op"), OPS.get(event.get("op"), "")))
    for side in ("before", "after"):
        row = event.get(side)
        if row is None:
            print("  %s: null" % side)
            continue
        print("  %s:" % side)
        for name, value in row.items():
            print("    %-10s %s" % (name, short(value)))
print("(%d events)" % count)
