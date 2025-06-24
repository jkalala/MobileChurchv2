-- v22-remove-bad-policy.sql  (run once, optional but recommended)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own profile"   ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile"   ON user_profiles;
-- Re-create SAFE versions (no sub-queries, no recursion)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_row_read"   ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_row_insert" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own_row_update" ON user_profiles FOR UPDATE USING (auth.uid() = id);
