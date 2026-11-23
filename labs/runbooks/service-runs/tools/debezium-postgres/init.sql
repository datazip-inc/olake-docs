-- Two databases in one PostgreSQL instance. They share one write-ahead log (WAL).

-- A small max_wal_size, so that a few hundred megabytes of writes show what a slot does to pg_wal.
-- Both settings are read when the server starts after this script.
ALTER SYSTEM SET max_wal_size = '64MB';
ALTER SYSTEM SET min_wal_size = '32MB';

CREATE DATABASE appdb;    -- the busy database
CREATE DATABASE quietdb;  -- a database that is captured and never written to

\connect appdb

-- The table that produces the WAL. It is not in the publication, so the connector never reads it.
-- Autovacuum is off on it so that the WAL figures in the logs are the lab's own writes.
CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  customer_id int  NOT NULL,
  status      text NOT NULL,
  note        text,
  updated_at  timestamptz NOT NULL DEFAULT now()
) WITH (autovacuum_enabled = off);

-- The table the connector captures.
CREATE TABLE notes (
  id         bigserial PRIMARY KEY,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Writes rows until at least target_mb megabytes of WAL exist, then stops. Each transaction holds
-- 5,000 rows for "orders" and, when with_note is true, one row for "notes", so the connector gets
-- one change event for about every 1.6 MB of WAL. "orders" is emptied every 50,000 rows, so the
-- data files stay small and only the WAL grows.
CREATE PROCEDURE write_wal(target_mb int, with_note boolean DEFAULT true) LANGUAGE plpgsql AS $$
DECLARE
  start_lsn pg_lsn := pg_current_wal_lsn();
BEGIN
  WHILE pg_wal_lsn_diff(pg_current_wal_lsn(), start_lsn) < target_mb::numeric * 1024 * 1024 LOOP
    INSERT INTO orders (customer_id, status, note)
    SELECT g % 1000, 'new', repeat(md5(g::text), 8) FROM generate_series(1, 5000) g;
    IF with_note THEN
      INSERT INTO notes (body) VALUES ('batch at ' || pg_current_wal_lsn());
    END IF;
    COMMIT;
    IF (SELECT count(*) FROM orders) >= 50000 THEN
      TRUNCATE orders;
      COMMIT;
    END IF;
  END LOOP;
END $$;

CREATE PUBLICATION cdc_pub FOR TABLE notes;

\connect quietdb

CREATE TABLE customers (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO customers VALUES (1, 'Sally'), (2, 'George');

CREATE TABLE heartbeat (id int PRIMARY KEY, ts timestamptz NOT NULL);
INSERT INTO heartbeat VALUES (1, now());

-- Two publications, so that one run can have the heartbeat table inside the connector's
-- publication and another run can have it outside.
CREATE PUBLICATION quiet_pub FOR TABLE customers;
CREATE PUBLICATION quiet_hb_pub FOR TABLE customers, heartbeat;
