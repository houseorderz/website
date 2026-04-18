ALTER TABLE app_users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client';

UPDATE app_users SET role = 'client' WHERE role IS NULL;

ALTER TABLE app_users ALTER COLUMN role SET NOT NULL;
ALTER TABLE app_users ALTER COLUMN role SET DEFAULT 'client';

ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_role_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_role_check CHECK (role IN ('admin', 'client'));

-- Promote an account to admin (replace email):
-- UPDATE app_users SET role = 'admin' WHERE LOWER(email) = LOWER('you@example.com');
