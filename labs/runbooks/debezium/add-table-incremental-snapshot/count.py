"""Count the change events of one Kafka topic, read from kafka-console-consumer on stdin.

Prints how many events arrived by operation and by the source.snapshot field, how many distinct
rows they cover, and, with --ids (a file with the table's key values, one per line), how many rows
of the table never arrived. With --sample, also prints the first read (op=r) event.
"""
import argparse
import collections
import json
import sys

parser = argparse.ArgumentParser()
parser.add_argument("--key", default="id", help="the key column of the table")
parser.add_argument("--ids", help="file with the key values of every row in the table")
parser.add_argument("--sample", action="store_true", help="print the first read event")
parser.add_argument("--compare", help='file of "id quantity" lines: compare the last event of each row')
args = parser.parse_args()

ops = collections.Counter()
snapshot = collections.Counter()
events_per_row = collections.Counter()
read_rows = set()
last = {}
sample = None

for line in sys.stdin:
    line = line.strip()
    if not line or line == "null":
        continue
    try:
        value = json.loads(line)
    except ValueError:
        continue
    payload = value.get("payload", value) if isinstance(value, dict) else None
    if not isinstance(payload, dict) or "op" not in payload:
        continue
    op = payload["op"]
    ops[op] += 1
    source = payload.get("source") or {}
    snapshot[str(source.get("snapshot"))] += 1
    row = payload.get("after") or payload.get("before") or {}
    key = row.get(args.key)
    events_per_row[key] += 1
    last[key] = None if op == "d" else row
    if op == "r":
        read_rows.add(key)
        if sample is None:
            sample = {"op": op, "after": row,
                      "source": {k: source.get(k) for k in ("version", "name", "snapshot", "db", "table")}}

total = sum(ops.values())
print("  events: %d (%s)" % (total, ", ".join("op=%s %d" % kv for kv in sorted(ops.items())) or "none"))
if total:
    print("  source.snapshot: %s" % ", ".join("%s %d" % kv for kv in sorted(snapshot.items())))
    repeated = sum(1 for n in events_per_row.values() if n > 1)
    print("  distinct %s values: %d, read as op=r: %d, with more than one event: %d"
          % (args.key, len(events_per_row), len(read_rows), repeated))
if args.ids:
    with open(args.ids) as f:
        table = {int(x) for x in f.read().split()}
    seen = {k for k in events_per_row if k is not None}
    print("  rows in the table: %d, of them in the topic: %d, never arrived: %d"
          % (len(table), len(table & seen), len(table - seen)))
if args.sample and sample:
    print("  first read event: " + json.dumps(sample))
if args.compare:
    with open(args.compare) as f:
        table = {int(i): int(q) for i, q in (line.split() for line in f if line.strip())}
    same = sum(1 for i, q in table.items() if last.get(i) is not None and last[i].get("quantity") == q)
    differ = sorted(i for i, q in table.items() if last.get(i) is None or last[i].get("quantity") != q)
    gone = [k for k in last if k not in table]
    gone_deleted = sum(1 for k in gone if last[k] is None)
    gone_alive = sorted(k for k in gone if last[k] is not None)
    print("  rows in the table: %d, last event matches the table: %d, differs or is missing: %d %s"
          % (len(table), same, len(differ), differ[:10] if differ else ""))
    print("  rows deleted from the table: %d, last event is a delete: %d, last event is a row: %d %s"
          % (len(gone), gone_deleted, len(gone_alive), gone_alive[:10] if gone_alive else ""))
