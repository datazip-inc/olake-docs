#!/bin/bash
# dms-logs.sh <log stream> [start epoch ms]   prints "UTC time  message" for every event of a DMS task log stream
source "$(cd "$(dirname "$0")" && pwd)/env.sh"
aws logs get-log-events --log-group-name dms-tasks-$RB_DMS --log-stream-name "$1" --start-from-head ${2:+--start-time $2} --limit 10000 --query 'events[].[timestamp,message]' --output json | python3 -c "
import json,sys,datetime
for ts,msg in json.load(sys.stdin):
    print(datetime.datetime.fromtimestamp(ts/1000, datetime.timezone.utc).strftime('%H:%M:%S'), msg.rstrip())"
