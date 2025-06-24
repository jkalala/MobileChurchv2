-- Enhanced Department Management System
-- This script creates comprehensive department management with modern features

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS department_activities CASCADE;
DROP TABLE IF EXISTS department_members CASCADE;
DROP TABLE IF EXISTS department_leaders CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create departments table with enhanced features
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    department_type VARCHAR(50) NOT NULL CHECK (department_type IN (
        'worship', 'youth', 'children', 'women', 'men', 'sunday_school', 
        'bible_study', 'discipleship', 'outreach', 'hospitality', 
        'security', 'maintenance', 'finance', 'media', 'prayer'
    )),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'planning')),
    meeting_schedule VARCHAR(100),
    meeting_location VARCHAR(100),
    budget_allocated DECIMAL(10,2) DEFAULT 0,
    budget_spent DECIMAL(10,2) DEFAULT 0,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    established_date DATE DEFAULT CURRENT_DATE,
    goals TEXT,
    achievements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create department leaders table
CREATE TABLE department_leaders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('head', 'assistant', 'coordinator', 'secretary', 'treasurer')),
    appointed_date DATE DEFAULT CURRENT_DATE,
    term_end_date DATE,
    is_active BOOLEAN DEFAULT true,
    responsibilities TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(department_id, member_id, role)
);

-- Create department members table
CREATE TABLE department_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('member', 'volunteer', 'coordinator', 'assistant')),
    joined_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    skills TEXT,
    availability VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(department_id, member_id)
);

-- Create department activities table
CREATE TABLE department_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
        'meeting', 'event', 'training', 'service', 'workshop', 
        'retreat', 'conference', 'outreach', 'fundraising'
    )),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(100),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    budget_allocated DECIMAL(10,2) DEFAULT 0,
    budget_spent DECIMAL(10,2) DEFAULT 0,
    requirements TEXT,
    outcomes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_departments_type ON departments(department_type);
CREATE INDEX idx_departments_status ON departments(status);
CREATE INDEX idx_department_leaders_dept ON department_leaders(department_id);
CREATE INDEX idx_department_leaders_member ON department_leaders(member_id);
CREATE INDEX idx_department_members_dept ON department_members(department_id);
CREATE INDEX idx_department_members_member ON department_members(member_id);
CREATE INDEX idx_department_activities_dept ON department_activities(department_id);
CREATE INDEX idx_department_activities_date ON department_activities(scheduled_date);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_activities_updated_at BEFORE UPDATE ON department_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert departments" ON departments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update departments they created" ON departments FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete departments they created" ON departments FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "Users can view all department leaders" ON department_leaders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage department leaders" ON department_leaders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all department members" ON department_members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage department members" ON department_members FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all department activities" ON department_activities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert activities" ON department_activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update activities they created" ON department_activities FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete activities they created" ON department_activities FOR DELETE USING (created_by = auth.uid());

-- Insert sample departments
INSERT INTO departments (name, description, department_type, meeting_schedule, meeting_location, contact_email, goals) VALUES
('Worship Ministry', 'Leads congregational worship through music, singing, and multimedia presentations', 'worship', 'Sundays 8:00 AM, Wednesdays 7:00 PM', 'Sanctuary', 'worship@church.org', 'Create an atmosphere of worship that draws people closer to God'),
('Youth Ministry', 'Discipleship and fellowship for teenagers ages 13-18', 'youth', 'Fridays 7:00 PM', 'Youth Room', 'youth@church.org', 'Build strong Christian foundations in young people'),
('Children Ministry', 'Sunday school and programs for children ages 0-12', 'children', 'Sundays 9:00 AM', 'Children Building', 'children@church.org', 'Teach children about Jesus in age-appropriate ways'),
('Women Ministry', 'Fellowship, Bible study, and service opportunities for women', 'women', 'Saturdays 10:00 AM', 'Fellowship Hall', 'women@church.org', 'Encourage and equip women in their faith journey'),
('Men Ministry', 'Brotherhood, discipleship, and service for men', 'men', 'Saturdays 7:00 AM', 'Men Hall', 'men@church.org', 'Build godly men who lead their families and communities'),
('Outreach Ministry', 'Community service and evangelism programs', 'outreach', 'Monthly - 2nd Saturday', 'Community Center', 'outreach@church.org', 'Share the love of Christ with our community'),
('Hospitality Ministry', 'Welcome guests and coordinate fellowship events', 'hospitality', 'As needed', 'Church Lobby', 'hospitality@church.org', 'Make everyone feel welcomed and valued'),
('Media Ministry', 'Audio, video, and technical support for services', 'media', 'Sundays 7:30 AM', 'Media Booth', 'media@church.org', 'Support worship through excellent technical ministry'),
('Prayer Ministry', 'Coordinate prayer efforts and intercession', 'prayer', 'Wednesdays 6:00 AM', 'Prayer Room', 'prayer@church.org', 'Cover the church and community in prayer'),
('Finance Ministry', 'Manage church finances and stewardship education', 'finance', 'Monthly - 1st Tuesday', 'Conference Room', 'finance@church.org', 'Ensure faithful stewardship of church resources');

-- Insert sample activities
INSERT INTO department_activities (department_id, title, description, activity_type, scheduled_date, location, max_participants) 
SELECT 
    d.id,
    CASE 
        WHEN d.department_type = 'worship' THEN 'Choir Practice'
        WHEN d.department_type = 'youth' THEN 'Youth Game Night'
        WHEN d.department_type = 'children' THEN 'VBS Planning Meeting'
        WHEN d.department_type = 'women' THEN 'Women Bible Study'
        WHEN d.department_type = 'men' THEN 'Men Breakfast Fellowship'
        WHEN d.department_type = 'outreach' THEN 'Community Food Drive'
        WHEN d.department_type = 'hospitality' THEN 'New Member Welcome'
        WHEN d.department_type = 'media' THEN 'Equipment Training'
        WHEN d.department_type = 'prayer' THEN 'Prayer Walk'
        ELSE 'Department Meeting'
    END,
    CASE 
        WHEN d.department_type = 'worship' THEN 'Weekly choir practice for Sunday service'
        WHEN d.department_type = 'youth' THEN 'Fun games and fellowship for teens'
        WHEN d.department_type = 'children' THEN 'Planning for Vacation Bible School'
        WHEN d.department_type = 'women' THEN 'Study of Proverbs 31 woman'
        WHEN d.department_type = 'men' THEN 'Fellowship and devotion over breakfast'
        WHEN d.department_type = 'outreach' THEN 'Collect food for local food bank'
        WHEN d.department_type = 'hospitality' THEN 'Welcome and orient new church members'
        WHEN d.department_type = 'media' THEN 'Training on new sound equipment'
        WHEN d.department_type = 'prayer' THEN 'Prayer walk around the neighborhood'
        ELSE 'Regular department meeting'
    END,
    CASE 
        WHEN d.department_type IN ('worship', 'youth', 'children', 'women', 'men') THEN 'meeting'
        WHEN d.department_type = 'outreach' THEN 'service'
        WHEN d.department_type = 'hospitality' THEN 'event'
        WHEN d.department_type = 'media' THEN 'training'
        WHEN d.department_type = 'prayer' THEN 'service'
        ELSE 'meeting'
    END,
    NOW() + INTERVAL '7 days',
    d.meeting_location,
    CASE 
        WHEN d.department_type = 'worship' THEN 30
        WHEN d.department_type = 'youth' THEN 25
        WHEN d.department_type = 'children' THEN 15
        WHEN d.department_type = 'women' THEN 20
        WHEN d.department_type = 'men' THEN 20
        WHEN d.department_type = 'outreach' THEN 50
        WHEN d.department_type = 'hospitality' THEN 10
        WHEN d.department_type = 'media' THEN 8
        WHEN d.department_type = 'prayer' THEN 15
        ELSE 12
    END
FROM departments d;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Department Hub database setup completed successfully!';
    RAISE NOTICE 'Created tables: departments, department_leaders, department_members, department_activities';
    RAISE NOTICE 'Inserted % sample departments', (SELECT COUNT(*) FROM departments);
    RAISE NOTICE 'Inserted % sample activities', (SELECT COUNT(*) FROM department_activities);
END $$;
