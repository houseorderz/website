CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  item_count INTEGER NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, item_count, sort_order) VALUES
  ('Leather Jacket', 12, 1),
  ('Women Dress', 12, 2),
  ('Formal Shoe', 12, 3),
  ('Sweat Shirt', 12, 4),
  ('Hill Shoe', 12, 5),
  ('Formal Dress', 12, 6)
ON CONFLICT (name) DO NOTHING;
