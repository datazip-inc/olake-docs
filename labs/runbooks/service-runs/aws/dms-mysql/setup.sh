#!/bin/bash
# Creates the DMS endpoints and the task for the MySQL run. The password is read from the private
# secrets file into a JSON request file that is deleted straight after the call.
set -u
HERE=$(cd "$(dirname "$0")/.." && pwd); source "$HERE/env.sh"; source "$HERE/lib.sh"
SEC=$(dirname "$RB_SECRETS"); set -a; . "$RB_SECRETS"; set +a
export SRC_HOST=$RB_MYSQL_HOST TGT_HOST=$RB_AMYSQL_HOST
python3 - <<'PY'
import json, os
sec = os.path.dirname(os.environ["RB_SECRETS"]); pw = os.environ["DBPASS"]; user = os.environ["RB_MASTER"]
tags = [{"Key": "Project", "Value": "runbook-service-tests"}, {"Key": "Owner", "Value": "shubham"}, {"Key": "DeleteAfter", "Value": "2026-11-24"}]
eps = {
 "m-src.json": dict(EndpointIdentifier="rbtest-m-src", EndpointType="source", EngineName="mysql", ServerName=os.environ["SRC_HOST"], Port=3306, Username=user, Password=pw, SslMode="none", Tags=tags),
 "m-tgt.json": dict(EndpointIdentifier="rbtest-m-tgt", EndpointType="target", EngineName="aurora", ServerName=os.environ["TGT_HOST"], Port=3306, Username=user, Password=pw, SslMode="none", Tags=tags),
}
for name, body in eps.items():
    fd = os.open(os.path.join(sec, name), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f: json.dump(body, f)
PY
for f in m-src m-tgt; do aws dms create-endpoint --cli-input-json "file://$SEC/$f.json" --query 'Endpoint.[EndpointIdentifier,EndpointType,EngineName,Status]' --output text; rm -f "$SEC/$f.json"; done
