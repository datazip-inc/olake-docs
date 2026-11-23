#!/bin/bash
# DMS endpoints and tasks for the PostgreSQL slot cases. Passwords are read from the private secrets file
# into JSON request files that are deleted straight after each call.
set -u
HERE=$(cd "$(dirname "$0")" && pwd); . "$HERE/../env.sh"; . "$HERE/../lib.sh"
SCR=$(dirname "$RB_SECRETS"); set -a; . "$RB_SECRETS"; set +a
export SRC_HOST=$(rb_endpoint "$RB_PG") TGT_HOST=$(rb_cluster_endpoint "$RB_APG")
python3 - <<'PY'
import json, os
scr = os.path.dirname(os.environ["RB_SECRETS"])
tags = [{"Key": "Project", "Value": "runbook-service-tests"}, {"Key": "Owner", "Value": "shubham"}, {"Key": "DeleteAfter", "Value": "2026-11-24"}]
def ep(ident, kind, host, db):
    return dict(EndpointIdentifier=ident, EndpointType=kind, EngineName="postgres", ServerName=host, Port=5432, DatabaseName=db,
                Username=os.environ["RB_MASTER"], Password=os.environ["DBPASS"], SslMode="require", Tags=tags)
files = {"ep-src-appdb.json": ep("rbtest-p-src-appdb", "source", os.environ["SRC_HOST"], "appdb"),
         "ep-src-quietdb.json": ep("rbtest-p-src-quietdb", "source", os.environ["SRC_HOST"], "quietdb"),
         "ep-tgt.json": ep("rbtest-p-tgt", "target", os.environ["TGT_HOST"], "dmstarget")}
for n, b in files.items():
    fd = os.open(os.path.join(scr, n), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f: json.dump(b, f)
PY
for f in ep-src-appdb ep-src-quietdb ep-tgt; do
  aws dms create-endpoint --cli-input-json "file://$SCR/$f.json" --query 'Endpoint.[EndpointIdentifier,EndpointType,EngineName,Status]' --output text; rm -f "$SCR/$f.json"
done
RI=$(aws dms describe-replication-instances --filters Name=replication-instance-id,Values=$RB_DMS --query 'ReplicationInstances[0].ReplicationInstanceArn' --output text)
for e in rbtest-p-src-appdb rbtest-p-src-quietdb rbtest-p-tgt; do
  A=$(aws dms describe-endpoints --filters Name=endpoint-id,Values=$e --query 'Endpoints[0].EndpointArn' --output text)
  aws dms test-connection --replication-instance-arn "$RI" --endpoint-arn "$A" --query 'Connection.Status' --output text >/dev/null
done
for i in $(seq 1 30); do
  st=$(aws dms describe-connections --filters Name=replication-instance-arn,Values="$RI" --query 'Connections[?starts_with(EndpointIdentifier,`rbtest-p-`)].[EndpointIdentifier,Status,LastFailureMessage]' --output text)
  echo "$st" | grep -q testing || { echo "$st"; break; }; sleep 10
done
