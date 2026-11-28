# Lab: REPLICA IDENTITY, TOAST columns and `__debezium_unavailable_value`

Backs the runbook at `docs/runbooks/postgres/replica-identity-toast-columns.mdx`.

A table with large values is changed under each replica identity, and every change is read back from a `pgoutput` slot and a `test_decoding` slot. The same changes then go through a Debezium PostgreSQL connector, so the page can show what each reader received for a large value that an `UPDATE` did not touch. The lab also measures the lock that `ALTER TABLE ... REPLICA IDENTITY` takes and the write-ahead log (WAL) that `REPLICA IDENTITY FULL` adds.

## What you need

Docker with Compose. The PostgreSQL steps need about 400 MB of free memory and publish no host port. The Debezium steps start Kafka and Kafka Connect as well, need about 2.5 GB, and publish the Kafka Connect REST port on 18314. The 1.9.7.Final Debezium image is built for x86 only, so on Apple silicon it runs under emulation and starts slowly.

The two Python scripts run on the host with the standard library: `pgoutput.py` prints the `pgoutput` messages a slot holds, and `events.py` prints the Debezium events of a Kafka topic.

## Run it

```bash
./run.sh up              # PostgreSQL 19.0, wal_level = logical, the tables and the publication
./run.sh storage         # which values are stored out of line
./run.sh confirm         # the queries that find published tables, their identity and their large columns
./run.sh default         # REPLICA IDENTITY DEFAULT: an UPDATE that leaves large values alone, an UPDATE of one, a DELETE
./run.sh full            # the same changes with REPLICA IDENTITY FULL
./run.sh index           # the same changes with REPLICA IDENTITY USING INDEX
./run.sh nothing         # REPLICA IDENTITY NOTHING on a table with a primary key
./run.sh partitions      # REPLICA IDENTITY FULL on a partitioned table
./run.sh lock            # the lock the statement takes, how it waits, and who may run it
./run.sh wal             # the WAL an UPDATE writes under DEFAULT and under FULL
./run.sh consumer        # a consumer that writes the placeholder, and one that keeps the stored value
./run.sh down
```

Every PostgreSQL step on another version, captured under `logs/postgres-<version>/`:

```bash
PG_VERSION=13.23 ./run.sh all
```

The Debezium steps, captured under `logs/debezium-<version>-postgres-<version>/`:

```bash
PG_VERSION=19.0 ./run.sh dbz-all
PG_VERSION=13.23 DEBEZIUM_IMAGE=quay.io/debezium/connect:1.9.7.Final ./run.sh dbz-all
```

`dbz-all` runs `dbz-up` (Kafka, Kafka Connect, a connector with `plugin.name = pgoutput` on `public.documents`, and the snapshot), `dbz-default`, `dbz-full`, `dbz-placeholder` and `dbz-autoset`, then removes everything. `events-raw.jsonl` in each folder holds every event the connector wrote, with each value of more than 200 characters cut to its first 60 characters and its length.

## The tables

`init.sql` creates `appdb` with three tables, all in the publication `cdc_pub`:

- `documents`: two rows. `body` (text), `attachment` (bytea), `meta` (jsonb) and `tags` (text[]) are built from `md5` output, which does not compress well, so PostgreSQL stores them out of line. `summary` is 100,000 characters of one letter, which compresses so well that it stays in the row.
- `orders`: 200,000 small rows, for the lock and the WAL measurements. Autovacuum is off for this table so that it does not write WAL during a measurement.
- `measurements`: a table partitioned by list, with two partitions.

## What the runs showed

Run on 2026-11-27, each version on a fresh container.

| Image | `SELECT version()` | Started (UTC) |
| --- | --- | --- |
| `postgres:19.0` | PostgreSQL 19.0 (Debian 19.0-2.pgdg13+1) | 10:48 |
| `postgres:18.7` | PostgreSQL 18.7 (Debian 18.7-1.pgdg13+5) | 10:49 |
| `postgres:13.23` | PostgreSQL 13.23 (Debian 13.23-1.pgdg13+1) | 10:49 |

Unless a row names a version, the result was the same on all three. Log sequence numbers, process ids and timings differ between runs.

| Step | What was done | Result |
| --- | --- | --- |
| `storage` | The two rows of `documents` | `body`, `attachment`, `meta` and `tags` stored out of line, 16,000 to 36,020 bytes each (19.0: 16,000 to 32,200, compressed with `lz4`). `summary`, 100,000 characters, stored in the row: 411 bytes on 19.0, 1,156 bytes on 18.7 and 13.23. `default_toast_compression` is `lz4` on 19.0 and `pglz` on 18.7; 13.23 has no such setting. On 19.0 `pg_column_toast_chunk_id()` returned a value for the four columns and none for `summary` |
| `confirm` | The identity query and the storage query | Four published tables (`measurements` is listed by its two partitions), all `default` with a primary key. Twelve columns whose storage is not `p` |
| `default` | `INSERT`, `UPDATE` of `title`, `UPDATE` of `body`, `DELETE` under `DEFAULT` | `pgoutput`: the `UPDATE` of `title` sent kind `u` for the four large columns and all 100,000 characters of `summary`; the `UPDATE` of `body` sent `body` and `u` for the other three; the `DELETE` sent an old key with `id` only. `test_decoding`: `unchanged-toast-datum` in the same places, and `DELETE: id[bigint]:2` |
| `full` | The same changes under `FULL` | Each `UPDATE` sent an old row with every value and a new row with `u` for the unchanged large columns. The `DELETE` sent the whole old row |
| `index` | The same changes under `USING INDEX` on `title` | The `UPDATE` of `title` sent an old key with `title` only; the `UPDATE` of `body` sent no old key; the `DELETE` sent an old key with `title` only |
| `nothing` | `UPDATE` and `DELETE` under `NOTHING`, on a table with a primary key | `ERROR:  cannot update table "documents" because it does not have a replica identity and publishes updates` and the `delete` twin. An `INSERT` worked. Back to `DEFAULT`, both worked |
| `partitions` | `FULL` on the partitioned table, then a new partition | The partitioned table showed `full`, both partitions and the new one `default`. An `UPDATE` sent no old row, a `DELETE` an old key. After `FULL` on each partition: old rows |
| `lock` | `ALTER TABLE orders REPLICA IDENTITY FULL` | `AccessExclusiveLock`. 0.3 to 0.8 ms on 200,000 rows, same file node before and after. Behind an open read with `lock_timeout = 2s`: `ERROR:  canceling statement due to lock timeout`, and on 19.0 also `CONTEXT:  waiting for AccessExclusiveLock on relation 16402 of database 16384`. Without the timeout it waited, and a one-row read behind it timed out (19.0 adds `waiting for AccessShareLock`). As a role that does not own the table: `ERROR:  must be owner of table documents` |
| `wal` | One `UPDATE` of 10,000 rows of `orders`, and one `UPDATE` of `title` in `documents`, under `DEFAULT` and `FULL` | 19.0: 2,367,032 and 2,607,936 bytes; 768 and 110,288 bytes. 18.7: 2,367,032 and 2,607,936; 1,496 and 119,016. 13.23: 2,403,416 and 2,595,904; 1,496 and 119,040 |
| `consumer` | A `jsonb` cast of the placeholder, and one `UPDATE` event applied to a copy of `documents`, as it arrived and with a rule | `ERROR:  invalid input syntax for type json` with `DETAIL:  Token "__debezium_unavailable_value" is invalid.` Applied as it arrived, the placeholder replaced the stored values. With the rule, `title` changed and the four large values were kept |

### Debezium

| Run | Stack | Started (UTC) |
| --- | --- | --- |
| `logs/debezium-3.7.1-postgres-19.0` | `quay.io/debezium/connect:3.7.1.Final` (Kafka Connect 4.3.1), `apache/kafka:4.3.1`, `postgres:19.0` | 10:50 |
| `logs/debezium-1.9.7-postgres-13.23` | `quay.io/debezium/connect:1.9.7.Final` (Kafka Connect 3.2.0), `apache/kafka:4.3.1`, `postgres:13.23` | 10:54 |

The connector used `plugin.name = pgoutput`, the publication `cdc_pub` (`publication.autocreate.mode = disabled`), `table.include.list = public.documents` and the JSON converter without schemas. It connected as the superuser `postgres`.

| Step | What was done | Debezium 3.7.1 | Debezium 1.9.7 |
| --- | --- | --- | --- |
| `dbz-up` | Register the connector, read the snapshot | Both rows with every value. Log: `REPLICA IDENTITY for 'public.documents' is 'DEFAULT'; UPDATE and DELETE events will contain previous values only for PK columns` | The same, with the same log line |
| `dbz-default` | `UPDATE` of `title`, `UPDATE` of `body`, `DELETE`, under `DEFAULT` | `before: null`. `after`: `"__debezium_unavailable_value"` for `body` and `meta`, `"X19kZWJleml1bV91bmF2YWlsYWJsZV92YWx1ZQ=="` (the placeholder in base64) for `attachment`, `["__debezium_unavailable_value"]` for `tags`, `summary` in full. The `DELETE`: `before` with `id`, `title` as `""`, the rest `null` | The same, except `tags` was `null` |
| `dbz-full` | The same changes under `FULL` | `before` and `after` with every value for both updates; the `DELETE` with the whole old row. No warning in the log | The same |
| `dbz-placeholder` | `unavailable.value.placeholder = __lab_unavailable__`, then `toasted.value.placeholder = __lab_toasted__`, each logged in the configuration at task start | The first replaced the placeholder in all four columns. The second had no effect | The first had no effect. The second replaced it in `body`, `attachment` and `meta`; `tags` stayed `null` |
| `dbz-autoset` | `replica.identity.autoset.values = public.documents:FULL`, logged in the configuration at task start | Log: `Replica identity set to FULL for table 'public.documents'`. The table showed `full`, and the next `UPDATE` had every value | No log line about it. The table stayed `default`, and the next `UPDATE` had the placeholder |

## Limits of these runs

- One machine, Apple silicon. The 1.9.7.Final image ran under x86 emulation.
- PostgreSQL 14 to 17 were not run. Debezium 2.x and 3.0 to 3.6 were not run, so the version in which `replica.identity.autoset.values` began to work, `toasted.value.placeholder` stopped working and arrays changed from `null` to the placeholder is not known from these runs.
- The Debezium connector ran as a superuser. `replica.identity.autoset.values` with a role that does not own the table was not run.
- AWS DMS, Airbyte and Flink CDC were not run for this page.
- Each case ran once per version.
