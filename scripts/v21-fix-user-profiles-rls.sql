-- v21-fix-user-profiles-rls.sql  (idempotent)
-- --------------------------------------------
-- Removes any problematic policies on user_profiles
-- and re-creates a minimal, safe ruleset.
-- --------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'user_profiles'
  ) THEN
    RAISE EXCEPTION 'Table "user_profiles" does not exist.';
  END IF;
END$$;

-- 1.  Remove old policies & disable RLS
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile"          ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile"   ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile"   ON user_profiles;
DROP POLICY IF EXISTS "Admins manage all profiles"           ON user_profiles;
-- …drop any legacy names that may exist
DROP POLICY IF EXISTS users_manage_own_profile              ON user_profiles;

-- 2.  Re-enable RLS with recursion-free policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Each user may read / insert / update ONLY their own row
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);
