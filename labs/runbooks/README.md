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

`node scripts/runbooks/check.mjs` checks that every runbook page points to a lab that exists.
