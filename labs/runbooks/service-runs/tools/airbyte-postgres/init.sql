-- Two databases in one PostgreSQL instance. They share one write-ahead log (WAL).
-- A small max_wal_size, so that a few hundred megabytes of writes show what a slot does to pg_wal.
ALTER SYSTEM SET max_wal_size = '64MB';
ALTER SYSTEM SET min_wal_size = '32MB';

-- The role the connector uses, as the Airbyte set-up guide describes it: LOGIN and REPLICATION.
-- The replication slot is created by `run.sh up`, one per server, so that no unused slot holds WAL.
CREATE ROLE airbyte LOGIN PASSWORD 'labpw' REPLICATION;

CREATE DATABASE appdb;    -- the busy database
CREATE DATABASE quietdb;  -- a database that is captured and almost never written to

\connect appdb

CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  customer_id int  NOT NULL,
  status      text NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
INSERT INTO orders (customer_id, status) VALUES (1, 'new'), (2, 'new'), (3, 'paid'), (4, 'shipped');

-- A table that is not in the publication. Writing to it grows the WAL without giving the
-- connector any change to read. Autovacuum is off so that the WAL figures are the lab's own writes.
CREATE TABLE noise (
  id   bigserial PRIMARY KEY,
  note text
) WITH (autovacuum_enabled = off);

-- Writes rows until at least target_mb megabytes of WAL exist, then stops. The table is emptied
-- every 50,000 rows, so the data files stay small and only the WAL grows.
CREATE PROCEDURE write_wal(target_mb int) LANGUAGE plpgsql AS $$
DECLARE
  start_lsn pg_lsn := pg_current_wal_lsn();
BEGIN
  WHILE pg_wal_lsn_diff(pg_current_wal_lsn(), start_lsn) < target_mb::numeric * 1024 * 1024 LOOP
    INSERT INTO noise (note)
    SELECT repeat(md5(g::text), 8) FROM generate_series(1, 5000) g;
    COMMIT;
    IF (SELECT count(*) FROM noise) >= 50000 THEN
      TRUNCATE noise;
      COMMIT;
    END IF;
  END LOOP;
END $$;

GRANT USAGE ON SCHEMA public TO airbyte;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO airbyte;
CREATE PUBLICATION airbyte_pub FOR TABLE orders;

\connect quietdb

CREATE TABLE customers (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO customers VALUES (1, 'Asha'), (2, 'Bilal'), (3, 'Chen');
GRANT USAGE ON SCHEMA public TO airbyte;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO airbyte;
CREATE PUBLICATION airbyte_quiet_pub FOR TABLE customers;
