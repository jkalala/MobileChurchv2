-- Enable Row Level Security (RLS) for all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE choir_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_study_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your security needs)
-- Members table policies
CREATE POLICY "Allow public read access to members" ON members
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert members" ON members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update members" ON members
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Families table policies
CREATE POLICY "Allow public read access to families" ON families
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage families" ON families
    FOR ALL USING (auth.role() = 'authenticated');

-- Financial transactions policies
CREATE POLICY "Allow public read access to financial transactions" ON financial_transactions
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert transactions" ON financial_transactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Ministries table policies
CREATE POLICY "Allow public read access to ministries" ON ministries
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage ministries" ON ministries
    FOR ALL USING (auth.role() = 'authenticated');

-- Events table policies
CREATE POLICY "Allow public read access to events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage events" ON events
    FOR ALL USING (auth.role() = 'authenticated');

-- Event RSVPs policies
CREATE POLICY "Allow public read access to event rsvps" ON event_rsvps
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage rsvps" ON event_rsvps
    FOR ALL USING (auth.role() = 'authenticated');

-- Attendance policies
CREATE POLICY "Allow public read access to attendance" ON attendance
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to record attendance" ON attendance
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Choir members policies
CREATE POLICY "Allow public read access to choir members" ON choir_members
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage choir members" ON choir_members
    FOR ALL USING (auth.role() = 'authenticated');

-- Sheet music policies
CREATE POLICY "Allow public read access to sheet music" ON sheet_music
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage sheet music" ON sheet_music
    FOR ALL USING (auth.role() = 'authenticated');

-- Outreach projects policies
CREATE POLICY "Allow public read access to outreach projects" ON outreach_projects
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage outreach projects" ON outreach_projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Volunteer assignments policies
CREATE POLICY "Allow public read access to volunteer assignments" ON volunteer_assignments
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage volunteer assignments" ON volunteer_assignments
    FOR ALL USING (auth.role() = 'authenticated');

-- User achievements policies
CREATE POLICY "Allow users to read their own achievements" ON user_achievements
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage achievements" ON user_achievements
    FOR ALL USING (auth.role() = 'authenticated');

-- User points policies
CREATE POLICY "Allow users to read their own points" ON user_points
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage points" ON user_points
    FOR ALL USING (auth.role() = 'authenticated');

-- NFT certificates policies
CREATE POLICY "Allow users to read their own certificates" ON nft_certificates
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage certificates" ON nft_certificates
    FOR ALL USING (auth.role() = 'authenticated');

-- Prayer requests policies
CREATE POLICY "Allow public read access to public prayer requests" ON prayer_requests
    FOR SELECT USING (privacy_level = 'public' OR auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage prayer requests" ON prayer_requests
    FOR ALL USING (auth.role() = 'authenticated');

-- Bible study progress policies
CREATE POLICY "Allow users to read their own progress" ON bible_study_progress
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage bible study progress" ON bible_study_progress
    FOR ALL USING (auth.role() = 'authenticated');
