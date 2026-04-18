ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10, 2);

UPDATE products
SET compare_at_price = ROUND((price * 1.26)::numeric, 2)
WHERE compare_at_price IS NULL;

UPDATE products
SET description = 'Soft, breathable fabric with a relaxed silhouette—made for everyday comfort. Part of our core collection designed to pair easily with your wardrobe essentials. Machine washable; retains shape wear after wear.'
WHERE description IS NULL OR TRIM(description) = '';
