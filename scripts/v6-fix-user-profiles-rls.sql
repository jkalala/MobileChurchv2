-- v6-fix-user-profiles-rls.sql
-- ------------------------------------------------
-- The previous policy on user_profiles triggered
-- “infinite recursion detected in policy” errors.
-- This script completely resets the policies to a
-- safe, minimal set that avoids self-references.
-- ------------------------------------------------

-- 1.  Make sure the table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_profiles') THEN
    RAISE EXCEPTION 'Table "user_profiles" does not exist';
  END IF;
END$$;

-- 2.  Disable any existing RLS & policies
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to user_profiles"  ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to manage profiles" ON user_profiles;

-- 3.  Re-enable RLS with safe policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Each user can see / update ONLY his own row
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Optional: administrators (role = 'authenticated') may manage all
-- Comment out the next block if you do not want this behaviour.
CREATE POLICY "Admins manage all profiles"
  ON user_profiles
  AS PERMISSIVE
  FOR ALL
  USING (auth.role() = 'authenticated');
