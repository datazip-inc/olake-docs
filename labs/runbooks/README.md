# Runbook labs

Each folder here reproduces one failure that a page under `docs/runbooks/` explains. A page is written only after its lab has shown the failure and the fix, and the page quotes the output the lab captured.

```text
labs/runbooks/<family>/<slug>/
  docker-compose.yml   the smallest stack that shows the failure, with pinned versions
  run.sh               one subcommand per step: break it, fix it, tear it down
  README.md            what each run showed, with the date and the exact versions
  logs/                status responses and log lines captured from the runs
```

Rules for a lab:

- Pin every image to a version. Say in the read-me which versions were run and when.
- Publish no host ports except the ones a reader needs for `curl`.
- Keep the fix for the tool the page is about. A lab never "fixes" a failure by switching tools.
- When a page changes, run the lab again and update `runbook.reproduced` in the page front matter. The date changes only when the lab is run.

## Runs on managed services and with other tools

Some runbooks also say what a managed database service or another tool does in the same situation. Those statements are backed by the runs under [`service-runs/`](service-runs/README.md): Amazon RDS, Aurora and DMS, Google Cloud SQL, Azure, and Debezium, Airbyte and Flink CDC. The cloud runs need an account, so they have a set-up script and a teardown script where the other labs have a Compose file. A page that uses them names the folders in `runbook.reproduced.services` in its front matter, with the date of those runs.

`node scripts/runbooks/check.mjs` checks that every runbook page points to a lab that exists, and that the service-run folders it names exist.
