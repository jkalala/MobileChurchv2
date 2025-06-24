-- Temporarily disable RLS for testing
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE families DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;

-- Or create permissive policies for demo/development
-- Uncomment these if you want to keep RLS enabled:

-- DROP POLICY IF EXISTS "Enable read access for all users" ON members;
-- DROP POLICY IF EXISTS "Enable insert access for all users" ON members;
-- DROP POLICY IF EXISTS "Enable update access for all users" ON members;
-- DROP POLICY IF EXISTS "Enable delete access for all users" ON members;

-- CREATE POLICY "Enable read access for all users" ON members FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON members FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON members FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for all users" ON members FOR DELETE USING (true);

-- Same for other tables
-- CREATE POLICY "Enable all access for families" ON families FOR ALL USING (true);
-- CREATE POLICY "Enable all access for attendance" ON attendance FOR ALL USING (true);
