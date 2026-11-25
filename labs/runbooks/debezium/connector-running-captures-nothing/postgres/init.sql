-- Runs in the "inventory" database. The tables live in the default schema, "public".
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

CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES public.customers (id),
  quantity INT NOT NULL,
  placed_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO public.orders (customer_id, quantity) VALUES (1, 1), (2, 2), (3, 2), (4, 1);
