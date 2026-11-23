-- Target table of the put-failure step. The CHECK constraint is what the sink will trip over.
CREATE TABLE public.orders_jdbc (
  id INT PRIMARY KEY,
  item VARCHAR(32) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0)
);
