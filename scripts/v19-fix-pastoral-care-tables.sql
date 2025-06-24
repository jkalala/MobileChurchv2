-- Fix pastoral care management tables by removing invalid references

-- Drop existing tables if they exist to recreate them properly
DROP TABLE IF EXISTS care_assignments CASCADE;
DROP TABLE IF EXISTS prayer_interactions CASCADE;
DROP TABLE IF EXISTS counseling_sessions CASCADE;
DROP TABLE IF EXISTS crisis_alerts CASCADE;
DROP TABLE IF EXISTS care_team_members CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS care_records CASCADE;

-- Care records table
CREATE TABLE care_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    care_type VARCHAR(50) NOT NULL CHECK (care_type IN ('visit', 'call', 'counseling', 'prayer', 'crisis', 'follow_up', 'hospital', 'bereavement')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR(30) NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'follow_up_needed')) DEFAULT 'scheduled',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    notes TEXT,
    scheduled_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    assigned_to UUID, -- Removed foreign key constraint to avoid issues
    location VARCHAR(255),
    duration_minutes INTEGER,
    follow_up_date TIMESTAMPTZ,
    tags TEXT[],
    confidential BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer requests table
CREATE TABLE prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    requester_name VARCHAR(255) NOT NULL,
    requester_email VARCHAR(255),
    requester_phone VARCHAR(50),
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('personal', 'family', 'health', 'financial', 'spiritual', 'other')) DEFAULT 'personal',
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'answered', 'ongoing', 'closed')) DEFAULT 'active',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    assigned_to UUID, -- Removed foreign key constraint
    prayer_count INTEGER DEFAULT 0,
    answered_date TIMESTAMPTZ,
    answer_description TEXT,
    follow_up_needed BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Care team members table
CREATE TABLE care_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('pastor', 'associate_pastor', 'elder', 'deacon', 'care_volunteer', 'counselor')),
    specializations TEXT[],
    availability JSONB,
    max_weekly_visits INTEGER DEFAULT 10,
    current_caseload INTEGER DEFAULT 0,
    contact_preferences TEXT[],
    languages TEXT[],
    certifications TEXT[],
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crisis alerts table
CREATE TABLE crisis_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('medical', 'mental_health', 'family_crisis', 'financial', 'spiritual', 'emergency')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'responding', 'resolved', 'escalated')) DEFAULT 'active',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reported_by VARCHAR(255) NOT NULL,
    assigned_to UUID, -- Removed foreign key constraint
    response_team UUID[],
    location VARCHAR(255),
    contact_info VARCHAR(255),
    immediate_needs TEXT[],
    resources_provided TEXT[],
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Counseling sessions table
CREATE TABLE counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    counselor_id UUID, -- Removed foreign key constraint
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('individual', 'couple', 'family', 'group')) DEFAULT 'individual',
    session_focus VARCHAR(50) NOT NULL CHECK (session_focus IN ('marriage', 'grief', 'addiction', 'depression', 'anxiety', 'spiritual', 'other')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    scheduled_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255),
    session_notes TEXT,
    homework_assigned TEXT,
    next_session_date TIMESTAMPTZ,
    progress_rating INTEGER CHECK (progress_rating >= 1 AND progress_rating <= 10),
    confidential_notes TEXT,
    resources_provided TEXT[],
    referrals_made TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prayer interactions table (for tracking who prayed for what)
CREATE TABLE prayer_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_request_id UUID REFERENCES prayer_requests(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('prayed', 'shared', 'commented')) DEFAULT 'prayed',
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(prayer_request_id, member_id, interaction_type)
);

-- Care record assignments table (for tracking care team assignments)
CREATE TABLE care_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    care_record_id UUID REFERENCES care_records(id) ON DELETE CASCADE,
    care_team_member_id UUID REFERENCES care_team_members(id) ON DELETE CASCADE,
    assigned_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) NOT NULL CHECK (status IN ('assigned', 'accepted', 'declined', 'completed')) DEFAULT 'assigned',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_care_records_member_id ON care_records(member_id);
CREATE INDEX idx_care_records_assigned_to ON care_records(assigned_to);
CREATE INDEX idx_care_records_status ON care_records(status);
CREATE INDEX idx_care_records_priority ON care_records(priority);
CREATE INDEX idx_care_records_scheduled_date ON care_records(scheduled_date);

CREATE INDEX idx_prayer_requests_member_id ON prayer_requests(member_id);
CREATE INDEX idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX idx_prayer_requests_priority ON prayer_requests(priority);
CREATE INDEX idx_prayer_requests_assigned_to ON prayer_requests(assigned_to);

CREATE INDEX idx_crisis_alerts_member_id ON crisis_alerts(member_id);
CREATE INDEX idx_crisis_alerts_status ON crisis_alerts(status);
CREATE INDEX idx_crisis_alerts_severity ON crisis_alerts(severity);
CREATE INDEX idx_crisis_alerts_assigned_to ON crisis_alerts(assigned_to);

CREATE INDEX idx_counseling_sessions_member_id ON counseling_sessions(member_id);
CREATE INDEX idx_counseling_sessions_counselor_id ON counseling_sessions(counselor_id);
CREATE INDEX idx_counseling_sessions_scheduled_date ON counseling_sessions(scheduled_date);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_care_records_updated_at BEFORE UPDATE ON care_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_care_team_members_updated_at BEFORE UPDATE ON care_team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_counseling_sessions_updated_at BEFORE UPDATE ON counseling_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_care_assignments_updated_at BEFORE UPDATE ON care_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE care_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - should be customized based on church needs)
CREATE POLICY "Care team can view all care records" ON care_records FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM care_team_members ctm 
        WHERE ctm.member_id = auth.uid() AND ctm.active = true
    )
);

CREATE POLICY "Members can view their own care records" ON care_records FOR SELECT USING (
    member_id = auth.uid()
);

CREATE POLICY "Public prayer requests are viewable by all" ON prayer_requests FOR SELECT USING (
    is_public = true OR member_id = auth.uid()
);

CREATE POLICY "Care team can view all prayer requests" ON prayer_requests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM care_team_members ctm 
        WHERE ctm.member_id = auth.uid() AND ctm.active = true
    )
);

-- Create policy for care team members
CREATE POLICY "Care team members can view their own records" ON care_team_members FOR SELECT USING (
    member_id = auth.uid()
);

-- Create policy for crisis alerts
CREATE POLICY "Care team can view crisis alerts" ON crisis_alerts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM care_team_members ctm 
        WHERE ctm.member_id = auth.uid() AND ctm.active = true
    )
);

-- Create policy for counseling sessions
CREATE POLICY "Counselors can view their sessions" ON counseling_sessions FOR SELECT USING (
    counselor_id = auth.uid() OR member_id = auth.uid()
);

-- Create policy for prayer interactions
CREATE POLICY "Members can view their prayer interactions" ON prayer_interactions FOR SELECT USING (
    member_id = auth.uid()
);

-- Create policy for care assignments
CREATE POLICY "Care team can view assignments" ON care_assignments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM care_team_members ctm 
        WHERE ctm.member_id = auth.uid() AND ctm.active = true
    )
);

-- Insert sample care team member (using existing member if available)
DO $$
DECLARE
    sample_member_id UUID;
BEGIN
    -- Get a sample member ID
    SELECT id INTO sample_member_id FROM members LIMIT 1;
    
    -- Only insert if we have a member
    IF sample_member_id IS NOT NULL THEN
        INSERT INTO care_team_members (
            member_id, 
            role, 
            specializations, 
            availability, 
            max_weekly_visits, 
            contact_preferences, 
            languages
        ) VALUES (
            sample_member_id,
            'pastor',
            ARRAY['grief_counseling', 'crisis_intervention', 'spiritual_direction'],
            '{"monday": {"start": "09:00", "end": "17:00", "available": true}, "tuesday": {"start": "09:00", "end": "17:00", "available": true}}'::jsonb,
            15,
            ARRAY['phone', 'email', 'in_person'],
            ARRAY['Portuguese', 'English']
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample prayer request
DO $$
DECLARE
    sample_member_id UUID;
BEGIN
    -- Get a sample member ID
    SELECT id INTO sample_member_id FROM members LIMIT 1;
    
    INSERT INTO prayer_requests (
        member_id,
        requester_name,
        requester_email,
        request_type,
        priority,
        status,
        title,
        description,
        is_anonymous,
        is_public,
        prayer_count,
        follow_up_needed,
        tags
    ) VALUES (
        sample_member_id,
        'João Silva',
        'joao@email.com',
        'health',
        'high',
        'active',
        'Healing from Surgery',
        'Please pray for complete healing and recovery from recent surgery',
        false,
        true,
        25,
        true,
        ARRAY['healing', 'surgery', 'recovery']
    ) ON CONFLICT DO NOTHING;
END $$;

-- Insert sample care record
DO $$
DECLARE
    sample_member_id UUID;
    care_team_id UUID;
BEGIN
    -- Get sample IDs
    SELECT id INTO sample_member_id FROM members LIMIT 1;
    SELECT id INTO care_team_id FROM care_team_members LIMIT 1;
    
    IF sample_member_id IS NOT NULL THEN
        INSERT INTO care_records (
            member_id,
            care_type,
            priority,
            status,
            title,
            description,
            scheduled_date,
            assigned_to,
            location,
            duration_minutes,
            tags,
            confidential
        ) VALUES (
            sample_member_id,
            'hospital',
            'high',
            'scheduled',
            'Hospital Visit - Surgery Recovery',
            'Post-surgery pastoral visit and prayer',
            NOW() + INTERVAL '1 day',
            care_team_id,
            'Hospital Central - Room 302',
            45,
            ARRAY['surgery', 'recovery', 'prayer'],
            false
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;

COMMIT;
