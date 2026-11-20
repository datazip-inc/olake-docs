# Lab: Kafka Connect cannot find a connector class

Backs the runbook at `docs/runbooks/kafka-connect/connector-class-not-found.mdx`.

A Kafka Connect worker answers `Failed to find any class that implements Connector and which name matches ...` when the class is not among the plug-ins it loaded at start-up. This lab starts a plain worker from a properties file and changes one thing per step: where `plugin.path` points and what sits there.

## What you need

Docker with Compose, `curl`, `python3`, `tar`, `unzip`, and about 2.5 GB of free memory (the three services have a `mem_limit` that adds up to 2464 MB). Port 18083 must be free, or set `CONNECT_PORT`.

`./run.sh fetch` downloads about 40 MB into `./work`, which is not kept in the repository: the Debezium PostgreSQL plug-in archives 3.7.1.Final and 1.9.7.Final from Maven Central, and from Confluent Hub the Debezium PostgreSQL connector archive, the Avro converter archive and the `confluent-hub` client.

## Run it

```bash
./run.sh fetch        # download the archives, lay out ./work
./run.sh up           # Kafka 4.3.1, PostgreSQL 16, and Kafka Connect 4.3.1 with no plugin.path
./run.sh missing      # "Failed to find any class that implements Connector"
./run.sh wrong-level  # plugin.path points at the folder that holds the jars
./run.sh half         # one jar missing, two variants
./run.sh fixed        # plugin.path points at the parent folder: the connector runs
./run.sh typo         # a wrong class name, and the short name
./run.sh lost         # the plug-in goes missing under a connector that exists
./run.sh no-restart   # the plug-in is copied back while the worker runs
./run.sh hub          # a Confluent Hub archive, then the confluent-hub client
./run.sh converter    # a converter class that is not installed, then installed
./run.sh discovery    # plugin.discovery=service_load and a plug-in without a manifest
./run.sh other-java   # old worker only: a plug-in built for a newer Java
./run.sh class-version  # the class file version of the two plug-in jars (no containers needed)
./run.sh down
```

`./run.sh all` runs the steps from `missing` to `other-java` in that order. On each restart the worker also logs two WARN lines that have nothing to do with plug-ins (`Close timed out with 1 pending requests to coordinator` and `Catching up to assignment's config offset.`); the `*-warnings.txt` files hold them next to anything else it warned about.

The worker is the Kafka distribution itself, started with `connect-distributed.sh /lab/worker.properties`. `run.sh` writes that file before each restart, so `./work/worker.properties` always shows the setting a step is testing.

Old worker, Kafka Connect 3.2.0 on Java 11, from an amd64 image:

```bash
export LEGACY=1 CONNECT_IMAGE=quay.io/debezium/connect:1.9 KAFKA_DIR=/kafka POSTGRES_IMAGE=postgres:13
export CONNECT_LOG4J_OPTS=-Dlog4j.configuration=file:/kafka/config.orig/connect-log4j.properties
./run.sh fetch && ./run.sh up && ./run.sh all && ./run.sh down
```

In this mode the main plug-in is Debezium 1.9.7.Final and the plug-in "of the other generation" is 3.7.1.Final. Set `LOG_DIR=logs/<folder>` to keep the responses and log lines of a run.

## What the runs showed

Run on 2026-11-16.

| Step | Kafka Connect 4.3.1, Java 21, Debezium plug-in 3.7.1.Final | Kafka Connect 3.2.0, Java 11, Debezium plug-in 1.9.7.Final |
| --- | --- | --- |
| `missing` | `GET /connector-plugins` lists the three MirrorMaker connectors. `POST /connectors` answers HTTP 400 with `Failed to find any class that implements Connector and which name matches io.debezium.connector.postgresql.PostgresConnector, available connectors are: ...`. No log line | Same list. HTTP 500 with the same message. The exception is in the worker log |
| `wrong-level` | Not listed. `Loading plugin from: .../debezium-connector-postgres-3.7.1.Final.jar`, then `ERROR Failed to discover SourceConnector in ...jar` with `java.lang.NoClassDefFoundError: io/debezium/metadata/ConfigDescriptor` | Not listed. `Loading plugin from: .../debezium-connector-postgres-1.9.7.Final.jar` and no WARN or ERROR line about the plug-in |
| `half`, without `debezium-connector-common` (3.7.1) or `debezium-core` (1.9.7) | Not listed. `ERROR Failed to discover SourceConnector in /lab/half-core/debezium-connector-postgres` with the same `NoClassDefFoundError` | Not listed. No WARN or ERROR line about the plug-in |
| `half`, without the PostgreSQL driver jar | Listed. `POST /connectors` answers HTTP 400: `Error during connection validation: java.lang.NoClassDefFoundError: org/postgresql/Driver` | Listed. HTTP 500 with an HTML error page; the log has `java.lang.NoClassDefFoundError: org/postgresql/Driver` and `Caused by: java.lang.ClassNotFoundException: org.postgresql.Driver` |
| `fixed` | Listed as `3.7.1.Final`. `Loading plugin from: /lab/plugins/debezium-connector-postgres`. HTTP 201, connector and task `RUNNING` | Listed as `1.9.7.Final`. Same log line. HTTP 201, connector and task `RUNNING` |
| `typo`, `io.debezium.connector.postgres.PostgresConnector` | HTTP 400, and the list in the message now contains the right class name | HTTP 500, same |
| `typo`, short name `PostgresConnector` | HTTP 201, then the task is `FAILED`: `java.lang.ClassNotFoundException: PostgresConnector` under `Unable to create service io.debezium.snapshot.SnapshotterService` | HTTP 201, connector and task `RUNNING` |
| `lost` | Connector `FAILED` with the error as its trace, task `FAILED` with `Failed to start task inventory-connector-0 since it is not a recognizable type (source or sink)`, `"type": "unknown"` | `GET /connectors/inventory-connector/status` answers HTTP 500 with the error as the message |
| `no-restart` | Not listed 30 seconds after the plug-in was copied in. Listed after a restart, and the connector is back to `RUNNING` | Same |
| `hub`, archive unzipped under `plugin.path` | Archive 3.2.6-4 has `assets`, `doc`, `etc`, `lib` and `manifest.json`. Listed as `3.2.6-4` | Archive 2.5.4-3, same layout. Listed as `2.5.4-3` |
| `hub`, `plugin.path` set to the `lib` folder | Not listed | Not listed |
| `hub`, `confluent-hub install` | Installs into `/lab/hub-components` and adds `plugin.path = /lab/hub-components` to the worker file. Listed after a restart | Not verified. The client stopped at the download with `javax.net.ssl.SSLHandshakeException: Remote host terminated the handshake`, and the worker file was left without `plugin.path` |
| `converter` | `io.confluent.connect.avro.AvroConverter` not listed; HTTP 400 `Class io.confluent.connect.avro.AvroConverter could not be found.` With archive 8.4.1 unzipped next to the connector and a restart: listed, validation returns no errors | Not run. The image carries an Avro converter on its class path |
| `discovery` | Debezium 1.9.7 plug-in, default `hybrid_warn`: listed, with `WARN One or more plugins are missing ServiceLoader manifests ...`. With `service_load`: not listed, HTTP 400. `connect-plugin-path.sh list` shows `isLoadable true`, `hasManifest false`. After `sync-manifests` and a restart: listed | `plugin.discovery=service_load` is ignored: `The configuration 'plugin.discovery' was supplied but isn't a known config.` The plug-in is listed |
| `other-java` | Not run. Needs a worker on an older Java than the plug-in | Debezium 3.7.1 plug-in on Java 11.0.15: not listed, HTTP 500 with the error, no WARN or ERROR line about the plug-in |
| `class-version` (reads the archives, no worker) | `PostgresConnector.class` in the 3.7.1 jar starts `cafebabe0000003d`, class file version 61 | In the 1.9.7 jar it starts `cafebabe00000034`, class file version 52 |

## Files

- `docker-compose.yml`: Kafka in KRaft mode, PostgreSQL, and a Kafka Connect worker whose image and install folder come from `CONNECT_IMAGE` and `KAFKA_DIR`. Only the Connect REST port is published.
- `postgres/init.sql`: one table, so that the connector has something to read once it loads.
- `run.sh`: every step above. `worker_props` writes the worker file, `fetch` builds the folders under `./work`.
- `logs/`: the output of the two runs, one folder per Kafka Connect version. `00-run-output.txt` is the whole run; the other files are the responses and log lines of single steps.
