-- Community Outreach CRM Tables
-- This script creates all necessary tables for the Community Outreach CRM system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Community Contacts Table
CREATE TABLE IF NOT EXISTS community_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    age_group VARCHAR(20),
    family_size INTEGER,
    interests TEXT[], -- Array of interests
    needs TEXT[], -- Array of needs
    contact_source VARCHAR(100) NOT NULL,
    contact_status VARCHAR(20) DEFAULT 'new' CHECK (contact_status IN ('new', 'contacted', 'engaged', 'member', 'inactive')),
    preferred_contact_method VARCHAR(20) DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'email', 'text', 'in_person')),
    language_preference VARCHAR(50),
    notes TEXT,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_follow_up_date TIMESTAMP WITH TIME ZONE,
    assigned_volunteer UUID, -- Simple UUID field without FK constraint
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach Programs Table
CREATE TABLE IF NOT EXISTS outreach_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    program_type VARCHAR(50) NOT NULL CHECK (program_type IN ('food_bank', 'community_service', 'education', 'health', 'youth', 'seniors', 'families', 'other')),
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed')),
    start_date DATE NOT NULL,
    end_date DATE,
    target_audience TEXT,
    goals TEXT,
    budget_allocated DECIMAL(10,2),
    budget_spent DECIMAL(10,2) DEFAULT 0,
    volunteer_coordinator UUID, -- Simple UUID field
    location VARCHAR(200),
    meeting_schedule VARCHAR(200),
    impact_metrics JSONB, -- Store metrics as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach Events Table
CREATE TABLE IF NOT EXISTS outreach_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES outreach_programs(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('outreach', 'community_service', 'food_distribution', 'health_fair', 'education', 'social')),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(200) NOT NULL,
    target_participants INTEGER,
    actual_participants INTEGER,
    volunteer_slots INTEGER,
    volunteers_registered INTEGER DEFAULT 0,
    resources_needed TEXT[],
    resources_provided TEXT[],
    coordinator_id UUID, -- Simple UUID field
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    feedback_summary TEXT,
    impact_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Partnerships Table
CREATE TABLE IF NOT EXISTS community_partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    partnership_type VARCHAR(50) NOT NULL CHECK (partnership_type IN ('nonprofit', 'government', 'business', 'school', 'healthcare', 'other')),
    partnership_status VARCHAR(20) DEFAULT 'prospective' CHECK (partnership_status IN ('prospective', 'active', 'inactive', 'ended')),
    collaboration_areas TEXT[],
    resources_shared TEXT[],
    joint_programs TEXT[],
    agreement_date DATE,
    renewal_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer Profiles Table
CREATE TABLE IF NOT EXISTS volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID, -- Simple UUID field, can reference members table if needed
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    skills TEXT[],
    interests TEXT[],
    availability JSONB, -- Store availability as JSON
    experience_level VARCHAR(20) DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'experienced', 'expert')),
    background_check_status VARCHAR(20) CHECK (background_check_status IN ('pending', 'approved', 'expired')),
    training_completed TEXT[],
    preferred_roles TEXT[],
    emergency_contact JSONB, -- Store emergency contact as JSON
    hours_contributed INTEGER DEFAULT 0,
    programs_involved TEXT[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_break')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach Interactions Table
CREATE TABLE IF NOT EXISTS outreach_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES community_contacts(id) ON DELETE CASCADE,
    volunteer_id UUID, -- Simple UUID field
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('phone_call', 'email', 'text', 'in_person', 'home_visit', 'event_attendance')),
    interaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('positive', 'neutral', 'negative', 'no_response')),
    follow_up_needed BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    program_id UUID REFERENCES outreach_programs(id) ON DELETE SET NULL,
    event_id UUID REFERENCES outreach_events(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_contacts_status ON community_contacts(contact_status);
CREATE INDEX IF NOT EXISTS idx_community_contacts_source ON community_contacts(contact_source);
CREATE INDEX IF NOT EXISTS idx_community_contacts_follow_up ON community_contacts(next_follow_up_date);
CREATE INDEX IF NOT EXISTS idx_outreach_programs_status ON outreach_programs(status);
CREATE INDEX IF NOT EXISTS idx_outreach_programs_type ON outreach_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_outreach_events_date ON outreach_events(date);
CREATE INDEX IF NOT EXISTS idx_outreach_events_status ON outreach_events(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_status ON volunteer_profiles(status);
CREATE INDEX IF NOT EXISTS idx_outreach_interactions_contact ON outreach_interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_outreach_interactions_date ON outreach_interactions(interaction_date);

-- Enable Row Level Security (RLS)
ALTER TABLE community_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for authenticated users)
DO $$ 
BEGIN
    -- Community Contacts policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_contacts' AND policyname = 'Enable all operations for authenticated users') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON community_contacts
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Outreach Programs policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outreach_programs' AND policyname = 'Enable all operations for authenticated users') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON outreach_programs
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Outreach Events policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outreach_events' AND policyname = 'Enable all operations for authenticated users') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON outreach_events
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Community Partnerships policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_partnerships' AND policyname = 'Enable all operations for authenticated users') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON community_partnerships
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Volunteer Profiles policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'volunteer_profiles' AND policyname = 'Enable all operations for authenticated users') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON volunteer_profiles
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    -- Outreach Interactions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outreach_interactions' AND policyname = 'Enable all operations for authenticated users') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON outreach_interactions
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Insert sample data safely
DO $$
BEGIN
    -- Insert sample community contacts
    IF NOT EXISTS (SELECT 1 FROM community_contacts WHERE id = 'demo-contact-1') THEN
        INSERT INTO community_contacts (
            id, first_name, last_name, email, phone, address, age_group, family_size,
            interests, needs, contact_source, contact_status, preferred_contact_method,
            language_preference, notes, last_contact_date, next_follow_up_date
        ) VALUES 
        (
            'demo-contact-1'::uuid, 'Ana', 'Silva', 'ana.silva@email.com', '+244 923 456 789',
            'Rua das Flores, 123, Maianga', '30-40', 4,
            ARRAY['community_service', 'children_programs'], ARRAY['food_assistance', 'job_training'],
            'food_distribution', 'engaged', 'phone', 'Portuguese',
            'Single mother, very interested in children programs',
            NOW() - INTERVAL '3 days', NOW() + INTERVAL '7 days'
        );
    END IF;

    -- Insert sample outreach programs
    IF NOT EXISTS (SELECT 1 FROM outreach_programs WHERE id = 'demo-program-1') THEN
        INSERT INTO outreach_programs (
            id, name, description, program_type, status, start_date, target_audience,
            goals, budget_allocated, budget_spent, location, meeting_schedule, impact_metrics
        ) VALUES 
        (
            'demo-program-1'::uuid, 'Banco Alimentar Comunitário',
            'Distribuição mensal de alimentos para famílias necessitadas',
            'food_bank', 'active', '2024-01-01', 'Famílias em situação de vulnerabilidade',
            'Atender 200 famílias mensalmente', 50000, 32000,
            'Centro Comunitário da Igreja', 'Toda primeira sexta-feira do mês',
            '{"people_served": 850, "volunteers_involved": 25, "resources_distributed": 12000, "follow_ups_completed": 340}'::jsonb
        );
    END IF;

    -- Insert sample volunteer profiles
    IF NOT EXISTS (SELECT 1 FROM volunteer_profiles WHERE id = 'demo-volunteer-1') THEN
        INSERT INTO volunteer_profiles (
            id, first_name, last_name, email, phone, skills, interests,
            availability, experience_level, background_check_status, training_completed,
            preferred_roles, emergency_contact, hours_contributed, programs_involved, status
        ) VALUES 
        (
            'demo-volunteer-1'::uuid, 'Grace', 'Mwangi', 'grace.mwangi@email.com', '+244 923 111 222',
            ARRAY['coordenacao', 'comunicacao', 'logistica'], ARRAY['assistencia_social', 'educacao'],
            '{"days": ["friday", "saturday", "sunday"], "times": ["morning", "afternoon"]}'::jsonb,
            'experienced', 'approved', ARRAY['primeiros_socorros', 'lideranca', 'gestao_voluntarios'],
            ARRAY['coordenador', 'facilitador'],
            '{"name": "John Mwangi", "phone": "+244 923 111 223", "relationship": "spouse"}'::jsonb,
            120, ARRAY['demo-program-1'], 'active'
        );
    END IF;

    -- Insert sample community partnerships
    IF NOT EXISTS (SELECT 1 FROM community_partnerships WHERE id = 'demo-partnership-1') THEN
        INSERT INTO community_partnerships (
            id, organization_name, contact_person, contact_email, contact_phone,
            partnership_type, partnership_status, collaboration_areas, resources_shared,
            joint_programs, agreement_date, renewal_date, notes
        ) VALUES 
        (
            'demo-partnership-1'::uuid, 'Hospital Municipal de Luanda', 'Dr. António Silva',
            'antonio.silva@hospital.gov.ao', '+244 222 123 456', 'healthcare', 'active',
            ARRAY['feiras_saude', 'campanhas_vacinacao', 'educacao_saude'],
            ARRAY['profissionais_saude', 'equipamentos_medicos', 'medicamentos'],
            ARRAY['Feira de Saúde Comunitária', 'Campanha de Vacinação'],
            '2024-01-15', '2025-01-15', 'Parceria muito produtiva, excelente colaboração'
        );
    END IF;

    -- Insert sample outreach events
    IF NOT EXISTS (SELECT 1 FROM outreach_events WHERE id = 'demo-event-1') THEN
        INSERT INTO outreach_events (
            id, program_id, title, description, event_type, date, start_time, end_time,
            location, target_participants, actual_participants, volunteer_slots,
            volunteers_registered, resources_needed, resources_provided, status, impact_notes
        ) VALUES 
        (
            'demo-event-1'::uuid, 'demo-program-1'::uuid, 'Distribuição de Alimentos - Janeiro',
            'Distribuição mensal de cestas básicas', 'food_distribution',
            CURRENT_DATE + INTERVAL '5 days', '08:00', '12:00',
            'Centro Comunitário da Igreja', 200, 185, 20, 18,
            ARRAY['cestas_basicas', 'voluntarios', 'transporte'],
            ARRAY['cestas_basicas', 'agua', 'lanche_voluntarios'],
            'confirmed', 'Atendimento eficiente, boa organização'
        );
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting sample data: %', SQLERRM;
END $$;

-- Create update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_community_contacts_updated_at') THEN
        CREATE TRIGGER update_community_contacts_updated_at 
            BEFORE UPDATE ON community_contacts 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_outreach_programs_updated_at') THEN
        CREATE TRIGGER update_outreach_programs_updated_at 
            BEFORE UPDATE ON outreach_programs 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_outreach_events_updated_at') THEN
        CREATE TRIGGER update_outreach_events_updated_at 
            BEFORE UPDATE ON outreach_events 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_community_partnerships_updated_at') THEN
        CREATE TRIGGER update_community_partnerships_updated_at 
            BEFORE UPDATE ON community_partnerships 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_volunteer_profiles_updated_at') THEN
        CREATE TRIGGER update_volunteer_profiles_updated_at 
            BEFORE UPDATE ON volunteer_profiles 
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Community Outreach CRM tables created successfully!';
    RAISE NOTICE 'Tables created: community_contacts, outreach_programs, outreach_events, community_partnerships, volunteer_profiles, outreach_interactions';
    RAISE NOTICE 'Sample data inserted for demonstration purposes';
END $$;
