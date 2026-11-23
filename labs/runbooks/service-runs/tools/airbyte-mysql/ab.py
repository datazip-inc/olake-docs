#!/usr/bin/env python3
"""Run an Airbyte source connector image directly and summarise what it printed.

The connector speaks the Airbyte protocol on standard output: one JSON message per line, of type
LOG, RECORD, STATE, TRACE, SPEC, CATALOG or CONNECTION_STATUS. This script runs one protocol command
(spec, check, discover or read) in a one-off container, keeps the complete output as a gzip file,
prints a short summary, and saves the last STATE message in the form the next `read --state` expects.

  ab.py --image IMG --network NET --work DIR --raw FILE.gz [--state-out FILE] [--show N] -- read --config /work/config.json ...
"""
import argparse
import gzip
import json
import os
import re
import subprocess
import sys
import time

INTERESTING = re.compile(
    r"ReplicationSlotManager|Saved offset|from scratch|commit up to|Successfully committed|close-reason|"
    r"Running Debezium engine version|watchdog|LSN flush mode|offset mismatch strategy|target position|"
    r"heartbeat|Heartbeat|no longer|resync|Re-sync|re-sync|Initial Debezium state|"
    r"Resetting|reset|invalidat|Invalid CDC|cursor position|is not available|not found on the server|"
    r"binlog|Binlog|GTID|capture instance|Capture instance|schema change|Schema change|min(imum)? LSN|"
    r"Debezium Engine has shut down|Current position|synthetic|full refresh|Full refresh"
)
NOISE = re.compile(r"TypeRegistry|JsonSchemaGenerator|Requested thread factory|Creating thread|is already mapped|"
                   r"ConfigDef|AbstractConfig|heartbeat\.interval|logStatistics")


def compact(obj, limit=260):
    """A copy of a state object with long strings cut, so that a log line stays readable."""
    if isinstance(obj, dict):
        return {k: compact(v, limit) for k, v in obj.items()}
    if isinstance(obj, list):
        return [compact(v, limit) for v in obj]
    if isinstance(obj, str) and len(obj) > limit:
        return obj[:limit] + "... (%d characters in all)" % len(obj)
    return obj


def main():
    if len(sys.argv) == 3 and sys.argv[1] == "--print-state":
        print(json.dumps(compact(json.load(open(sys.argv[2]))), sort_keys=True))
        return
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--network", required=True)
    ap.add_argument("--work", required=True, help="host directory mounted at /work")
    ap.add_argument("--raw", required=True, help="where the complete output goes (gzip)")
    ap.add_argument("--state-out", help="write the last STATE message here, as a list")
    ap.add_argument("--catalog-out", help="after discover: write a configured catalog here")
    ap.add_argument("--streams", default="", help="comma-separated stream names for --catalog-out")
    ap.add_argument("--show", type=int, default=3, help="records to print per stream")
    ap.add_argument("--memory", default="1g")
    ap.add_argument("--grep", help="extra regular expression of log lines to print")
    ap.add_argument("--quiet-logs", action="store_true", help="print only warnings, errors and --grep matches")
    ap.add_argument("--timeout", type=int, default=1800)
    ap.add_argument("cmd", nargs=argparse.REMAINDER)
    a = ap.parse_args()
    cmd = a.cmd[1:] if a.cmd and a.cmd[0] == "--" else a.cmd

    docker = ["docker", "run", "--rm", "--network", a.network, "--memory", a.memory,
              "-v", f"{os.path.abspath(a.work)}:/work", a.image] + cmd
    print("$ docker run --rm --network %s %s %s" % (a.network, a.image, " ".join(cmd)))
    started = time.time()
    os.makedirs(os.path.dirname(os.path.abspath(a.raw)), exist_ok=True)
    proc = subprocess.Popen(docker, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    counts, records, shown, logs, traces, states, other = {}, {}, {}, [], [], [], []
    catalog = None
    extra = re.compile(a.grep) if a.grep else None
    with gzip.open(a.raw, "wt") as raw:
        try:
            for line in proc.stdout:
                raw.write(line)
                line = line.rstrip("\n")
                try:
                    m = json.loads(line)
                    t = m.get("type", "?")
                except (ValueError, AttributeError):
                    m, t = None, "TEXT"
                counts[t] = counts.get(t, 0) + 1
                if t == "RECORD":
                    s = m["record"]["stream"]
                    records[s] = records.get(s, 0) + 1
                    if len(shown.setdefault(s, [])) < a.show:
                        shown[s].append(m["record"]["data"])
                    else:  # keep the newest ones as well
                        shown.setdefault(s + "\0last", [])
                        shown[s + "\0last"] = (shown[s + "\0last"] + [m["record"]["data"]])[-a.show:]
                elif t == "LOG":
                    logs.append((m["log"].get("level", ""), m["log"].get("message", "")))
                elif t == "TRACE":
                    traces.append(m["trace"])
                elif t == "STATE":
                    states.append(m["state"])
                elif t == "CATALOG":
                    catalog = m["catalog"]
                elif t == "TEXT":
                    other.append(line)
                else:
                    other.append(line[:2000])
                if time.time() - started > a.timeout:
                    proc.kill()
                    print("(killed after %d s)" % a.timeout)
                    break
        finally:
            rc = proc.wait()
    took = time.time() - started

    print("exit code %d after %d s; messages by type: %s" % (rc, took, json.dumps(counts, sort_keys=True)))
    if records:
        print("records per stream: %s" % json.dumps(records, sort_keys=True))
        for s in sorted(k for k in shown if "\0" not in k):
            for d in shown[s]:
                print("  %s first: %s" % (s, json.dumps(d, sort_keys=True)))
            for d in shown.get(s + "\0last", []):
                print("  %s last:  %s" % (s, json.dumps(d, sort_keys=True)))
    elif "read" in cmd:
        print("records per stream: none")
    print("--- connector log lines (warnings, errors, and lines about the saved position)")
    seen = set()
    for level, msg in logs:
        first = msg.split("\n")[0]
        keep = level in ("WARN", "ERROR", "FATAL") or (extra and extra.search(msg))
        if not keep and not a.quiet_logs and INTERESTING.search(first):
            keep = True
        if keep and NOISE.search(first) and not (extra and extra.search(msg)):
            keep = False
        if keep:
            key = re.sub(r"\d+", "N", first)[:160]
            if key in seen:
                continue
            seen.add(key)
            print(first[:600] if first.startswith(level) else "%s %s" % (level, first[:600]))
    for line in other[:20]:
        if line.strip():
            print("OUT %s" % line[:1500])
    for tr in traces:
        if tr.get("type") == "ERROR":
            e = tr.get("error", {})
            print("TRACE ERROR failure_type=%s" % e.get("failure_type"))
            print("  message: %s" % (e.get("message") or "")[:800])
            print("  internal_message: %s" % (e.get("internal_message") or "")[:800])
        elif tr.get("type") == "STREAM_STATUS":
            st = tr.get("stream_status", {})
            print("TRACE STREAM_STATUS %s %s" % (st.get("stream_descriptor", {}).get("name"), st.get("status")))
        elif tr.get("type") == "ANALYTICS":
            an = tr.get("analytics", {})
            print("TRACE ANALYTICS %s=%s" % (an.get("type"), an.get("value")))
    if catalog is not None:
        print("--- streams discovered")
        for st in catalog["streams"]:
            cols = sorted(k for k in st["json_schema"]["properties"])
            print("  %s.%s columns: %s" % (st.get("namespace"), st["name"], ", ".join(cols)))
        if a.catalog_out:
            want = [x for x in a.streams.split(",") if x]
            conf = {"streams": [
                {"stream": st, "sync_mode": "incremental", "destination_sync_mode": "append",
                 "cursor_field": st.get("default_cursor_field", []),
                 "primary_key": st.get("source_defined_primary_key", [])}
                for st in catalog["streams"] if not want or st["name"] in want]}
            with open(a.catalog_out, "w") as f:
                json.dump(conf, f)
            print("configured catalog with %d stream(s) saved to %s" % (len(conf["streams"]), a.catalog_out))
    print("--- state messages: %d" % len(states))
    if states:
        last = states[-1]
        print("last state: %s" % json.dumps(compact(last), sort_keys=True))
        if a.state_out:
            with open(a.state_out, "w") as f:
                json.dump([last], f)
            print("saved to %s" % a.state_out)
    print("complete output: %s" % a.raw)
    sys.exit(0)


if __name__ == "__main__":
    main()
