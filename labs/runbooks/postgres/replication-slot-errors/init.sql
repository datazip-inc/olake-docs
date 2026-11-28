-- Three databases in one PostgreSQL instance.
--   appdb    the database a change data capture (CDC) tool reads: a table, a publication, and a
--            procedure that writes WAL for the step that invalidates a slot
--   otherdb  a second database on the same server
--   subdb    a subscriber database, for PostgreSQL's own logical replication

CREATE DATABASE appdb;
CREATE DATABASE otherdb;
CREATE DATABASE subdb;

\connect appdb

CREATE TABLE orders (id bigint PRIMARY KEY, status text NOT NULL);
INSERT INTO orders SELECT g, 'new' FROM generate_series(1, 3) g;
CREATE PUBLICATION cdc_pub FOR TABLE orders;

-- Writes rows until at least target_mb megabytes of WAL exist, then stops. The table is emptied
-- after every batch, so only the WAL grows.
CREATE TABLE filler (id bigserial PRIMARY KEY, note text);
CREATE PROCEDURE write_wal(target_mb int) LANGUAGE plpgsql AS $$
DECLARE
  start_lsn pg_lsn := pg_current_wal_lsn();
BEGIN
  WHILE pg_wal_lsn_diff(pg_current_wal_lsn(), start_lsn) < target_mb::numeric * 1024 * 1024 LOOP
    INSERT INTO filler (note) SELECT repeat(md5(g::text), 8) FROM generate_series(1, 5000) g;
    COMMIT;
    TRUNCATE filler;
    COMMIT;
  END LOOP;
END $$;

\connect otherdb

CREATE TABLE orders (id bigint PRIMARY KEY, status text NOT NULL);

\connect subdb

CREATE TABLE orders (id bigint PRIMARY KEY, status text NOT NULL);
