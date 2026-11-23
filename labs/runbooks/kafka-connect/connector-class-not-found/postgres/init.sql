-- Runs in the "inventory" database. One small table, so the connector has something to read once it loads.
CREATE TABLE public.customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO public.customers (first_name, last_name, email) VALUES
  ('Sally', 'Thomas', 'sally.thomas@example.com'),
  ('George', 'Bailey', 'gbailey@example.com'),
  ('Edward', 'Walker', 'ed@example.com'),
  ('Anne', 'Kretchmar', 'annek@example.com');
