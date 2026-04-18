-- Slug links products.category_slug to categories (used by admin select + API validation)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug VARCHAR(64);

UPDATE categories
SET slug = trim(
  both '-'
  from regexp_replace(
    regexp_replace(lower(trim(name)), '[^a-z0-9]+', '-', 'g'),
    '-+',
    '-',
    'g'
  )
)
WHERE slug IS NULL OR btrim(slug) = '';

UPDATE categories
SET slug = 'category-' || id::text
WHERE slug IS NULL OR btrim(slug) = '';

-- Keep first id per slug; append -id for duplicates
UPDATE categories c
SET slug = c.slug || '-' || c.id::text
FROM (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) AS rn
    FROM categories
  ) x
  WHERE rn > 1
) dup
WHERE c.id = dup.id;

ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

-- Align with existing product seed (category_slug = clothes)
INSERT INTO categories (name, item_count, sort_order, slug)
SELECT 'Clothes', 0, 99, 'clothes'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'clothes');
