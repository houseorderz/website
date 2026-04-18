-- Soft delete: hide from catalog, restore from admin trash, purge after 10 days
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_products_active ON products (id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_products_trash_purge ON products (deleted_at) WHERE is_deleted = TRUE;
