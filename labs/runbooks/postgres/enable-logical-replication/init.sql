-- One database with three tables: one with a primary key, one without, one with a large column.

CREATE DATABASE appdb;

\connect appdb

CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  customer_id int  NOT NULL,
  status      text NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
INSERT INTO orders (customer_id, status) SELECT g, 'new' FROM generate_series(1, 3) g;

-- No primary key and no unique index.
CREATE TABLE events_nopk (
  device_id int  NOT NULL,
  reading   numeric NOT NULL,
  note      text
);
INSERT INTO events_nopk VALUES (1, 20.5, 'first'), (2, 21.0, 'second');

-- body is about 32 kB of text that does not compress well, so PostgreSQL stores it out of line (TOAST).
CREATE TABLE documents (
  id    bigserial PRIMARY KEY,
  title text NOT NULL,
  body  text NOT NULL
);
INSERT INTO documents (title, body)
SELECT 'first title', string_agg(md5(g::text), '') FROM generate_series(1, 1000) g;
