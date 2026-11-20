-- Two databases in one PostgreSQL instance. They share one write-ahead log (WAL).

-- A small max_wal_size, so that a few hundred megabytes of writes show what a slot does to pg_wal.
-- Both settings are read when the server starts after this script.
ALTER SYSTEM SET max_wal_size = '64MB';
ALTER SYSTEM SET min_wal_size = '32MB';

CREATE DATABASE appdb;    -- the busy database
CREATE DATABASE quietdb;  -- a database that is captured and almost never written to

\connect appdb

-- Autovacuum is off on this one table so that the WAL figures in the logs are the lab's own writes.
CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  customer_id int  NOT NULL,
  status      text NOT NULL,
  note        text,
  updated_at  timestamptz NOT NULL DEFAULT now()
) WITH (autovacuum_enabled = off);

-- Writes rows until at least target_mb megabytes of WAL exist, then stops. The table is emptied
-- every 50,000 rows, so the data files stay small and only the WAL grows.
CREATE PROCEDURE write_wal(target_mb int) LANGUAGE plpgsql AS $$
DECLARE
  start_lsn pg_lsn := pg_current_wal_lsn();
BEGIN
  WHILE pg_wal_lsn_diff(pg_current_wal_lsn(), start_lsn) < target_mb::numeric * 1024 * 1024 LOOP
    INSERT INTO orders (customer_id, status, note)
    SELECT g % 1000, 'new', repeat(md5(g::text), 8) FROM generate_series(1, 5000) g;
    COMMIT;
    IF (SELECT count(*) FROM orders) >= 50000 THEN
      TRUNCATE orders;
      COMMIT;
    END IF;
  END LOOP;
END $$;

-- A second table, for the session that leaves a transaction open.
CREATE TABLE notes (id bigserial PRIMARY KEY, body text);

CREATE PUBLICATION cdc_pub FOR TABLE orders, notes;

\connect quietdb

CREATE TABLE heartbeat (id int PRIMARY KEY, ts timestamptz NOT NULL);
INSERT INTO heartbeat VALUES (1, now());
CREATE PUBLICATION quiet_pub FOR TABLE heartbeat;
