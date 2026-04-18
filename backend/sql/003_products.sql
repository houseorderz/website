CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sold INTEGER NOT NULL DEFAULT 0 CHECK (sold >= 0),
  image_url TEXT NOT NULL,
  category_slug VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug);

-- Image URLs use Pexels CDN (verified reachable). Many prior Unsplash IDs returned 404.
INSERT INTO products (sku, name, price, stock, sold, image_url, category_slug) VALUES
  ('CLO-001', 'Classic White Crew Tee', 24.99, 86, 412, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-002', 'Slim Fit Denim Jeans', 79.50, 42, 198, 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-003', 'Merino Wool Crewneck', 98.00, 28, 156, 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-004', 'Linen Summer Shirt', 54.99, 55, 203, 'https://images.pexels.com/photos/6311662/pexels-photo-6311662.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-005', 'Essential Pullover Hoodie', 62.00, 67, 289, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-006', 'Navy Tailored Blazer', 189.99, 14, 72, 'https://images.pexels.com/photos/1154861/pexels-photo-1154861.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-007', 'Olive Cargo Trousers', 71.25, 31, 94, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-008', 'Striped Long Sleeve Tee', 36.00, 102, 340, 'https://images.pexels.com/photos/1755383/pexels-photo-1755383.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-009', 'Fleece Zip Hoodie', 58.99, 48, 177, 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-010', 'Khaki Chino Shorts', 44.50, 73, 215, 'https://images.pexels.com/photos/995978/pexels-photo-995978.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-011', 'Cable Knit Cardigan', 112.00, 22, 88, 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-012', 'Cotton Pique Polo', 42.99, 91, 401, 'https://images.pexels.com/photos/1694351/pexels-photo-1694351.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-013', 'Lightweight Rain Shell', 135.00, 19, 61, 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-014', 'Tapered Track Pants', 49.99, 64, 256, 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-015', 'Oxford Button Shirt', 59.00, 37, 143, 'https://images.pexels.com/photos/5480692/pexels-photo-5480692.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-016', 'Quilted Puffer Vest', 88.00, 26, 99, 'https://images.pexels.com/photos/1336874/pexels-photo-1336874.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-017', 'Ribbed Tank Top Pack', 29.50, 120, 512, 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-018', 'Midi Wrap Dress', 76.99, 33, 167, 'https://images.pexels.com/photos/4065209/pexels-photo-4065209.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-019', 'Wide Leg Tailored Pants', 92.00, 21, 54, 'https://images.pexels.com/photos/3755705/pexels-photo-3755705.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-020', 'Brushed Flannel Shirt', 54.00, 58, 221, 'https://images.pexels.com/photos/7671168/pexels-photo-7671168.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-021', 'Satin Bomber Jacket', 124.99, 16, 73, 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-022', 'High Rise Leggings', 38.99, 95, 445, 'https://images.pexels.com/photos/6311576/pexels-photo-6311576.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-023', 'Merino Turtleneck', 84.50, 29, 118, 'https://images.pexels.com/photos/1926768/pexels-photo-1926768.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-024', 'Vintage Wash Denim Jacket', 99.00, 24, 190, 'https://images.pexels.com/photos/7671244/pexels-photo-7671244.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-025', '7 Inch Athletic Shorts', 32.00, 77, 302, 'https://images.pexels.com/photos/7671254/pexels-photo-7671254.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-026', 'Silk Blend Blouse', 68.00, 18, 66, 'https://images.pexels.com/photos/7671260/pexels-photo-7671260.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-027', 'Pleated Midi Skirt', 56.99, 41, 134, 'https://images.pexels.com/photos/7671270/pexels-photo-7671270.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-028', 'Graphic Cotton Tee', 27.99, 110, 620, 'https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-029', 'Insulated Winter Parka', 219.00, 12, 48, 'https://images.pexels.com/photos/7671280/pexels-photo-7671280.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes'),
  ('CLO-030', 'Lounge Joggers Gray', 45.00, 88, 377, 'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop', 'clothes')
ON CONFLICT (sku) DO NOTHING;
