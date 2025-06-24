-- Create streaming and hybrid services tables
-- This script adds support for live streaming and hybrid service management

-- Streaming sessions table
CREATE TABLE IF NOT EXISTS streaming_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    stream_key VARCHAR(255) UNIQUE NOT NULL,
    rtmp_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'recording')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTERVAL,
    quality VARCHAR(20) DEFAULT '1080p' CHECK (quality IN ('1080p', '720p', '480p', '360p')),
    bitrate INTEGER DEFAULT 5000,
    fps INTEGER DEFAULT 30,
    viewer_count INTEGER DEFAULT 0,
    peak_viewers INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    chat_enabled BOOLEAN DEFAULT true,
    recording_enabled BOOLEAN DEFAULT true,
    recording_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    hybrid_mode BOOLEAN DEFAULT false,
    in_person_attendance INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream chat messages table
CREATE TABLE IF NOT EXISTS stream_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    member_id UUID REFERENCES members(id),
    user_name VARCHAR(255),
    message TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'message' CHECK (message_type IN ('message', 'prayer', 'donation', 'system')),
    donation_amount DECIMAL(10,2),
    is_moderated BOOLEAN DEFAULT false,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream analytics table
CREATE TABLE IF NOT EXISTS stream_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2),
    metric_data JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream viewers table (for tracking individual viewer sessions)
CREATE TABLE IF NOT EXISTS stream_viewers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    member_id UUID REFERENCES members(id),
    device_type VARCHAR(50),
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    join_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    leave_time TIMESTAMP WITH TIME ZONE,
    watch_duration INTERVAL,
    quality_watched VARCHAR(20),
    engagement_score INTEGER DEFAULT 0
);

-- Hybrid service coordination table
CREATE TABLE IF NOT EXISTS hybrid_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE SET NULL,
    in_person_capacity INTEGER,
    in_person_registered INTEGER DEFAULT 0,
    in_person_attended INTEGER DEFAULT 0,
    online_capacity INTEGER,
    online_registered INTEGER DEFAULT 0,
    online_attended INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT false,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    check_in_enabled BOOLEAN DEFAULT true,
    qr_code_url VARCHAR(500),
    hybrid_features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream donations table
CREATE TABLE IF NOT EXISTS stream_donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES members(id),
    donor_name VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AOA',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer requests from streams table
CREATE TABLE IF NOT EXISTS stream_prayer_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES members(id),
    requester_name VARCHAR(255),
    prayer_request TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    prayer_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream moderators table
CREATE TABLE IF NOT EXISTS stream_moderators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES members(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"can_delete_messages": true, "can_timeout_users": true, "can_highlight_messages": true}',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_streaming_sessions_status ON streaming_sessions(status);
CREATE INDEX IF NOT EXISTS idx_streaming_sessions_created_at ON streaming_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_chat_messages_stream_id ON stream_chat_messages(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_chat_messages_created_at ON stream_chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_stream_viewers_stream_id ON stream_viewers(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_analytics_stream_id ON stream_analytics(stream_id);
CREATE INDEX IF NOT EXISTS idx_hybrid_services_event_id ON hybrid_services(event_id);
CREATE INDEX IF NOT EXISTS idx_stream_donations_stream_id ON stream_donations(stream_id);
CREATE INDEX IF NOT EXISTS idx_stream_prayer_requests_stream_id ON stream_prayer_requests(stream_id);

-- Enable Row Level Security
ALTER TABLE streaming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hybrid_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_moderators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for streaming_sessions
CREATE POLICY "Users can view active streams" ON streaming_sessions
    FOR SELECT USING (status IN ('live', 'scheduled') OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create streams" ON streaming_sessions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Stream creators can update their streams" ON streaming_sessions
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Stream creators can delete their streams" ON streaming_sessions
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for stream_chat_messages
CREATE POLICY "Users can view chat messages for active streams" ON stream_chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM streaming_sessions 
            WHERE id = stream_id AND status = 'live'
        )
    );

CREATE POLICY "Authenticated users can send chat messages" ON stream_chat_messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for stream_donations
CREATE POLICY "Users can view stream donations" ON stream_donations
    FOR SELECT USING (NOT is_anonymous OR auth.uid() = donor_id);

CREATE POLICY "Authenticated users can make donations" ON stream_donations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for stream_prayer_requests
CREATE POLICY "Users can view prayer requests" ON stream_prayer_requests
    FOR SELECT USING (NOT is_anonymous OR auth.uid() = requester_id);

CREATE POLICY "Authenticated users can submit prayer requests" ON stream_prayer_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Functions for streaming analytics
CREATE OR REPLACE FUNCTION update_stream_viewer_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE streaming_sessions 
        SET viewer_count = viewer_count + 1,
            peak_viewers = GREATEST(peak_viewers, viewer_count + 1)
        WHERE id = NEW.stream_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.leave_time IS NULL AND NEW.leave_time IS NOT NULL THEN
        UPDATE streaming_sessions 
        SET viewer_count = viewer_count - 1
        WHERE id = NEW.stream_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating viewer count
CREATE TRIGGER trigger_update_stream_viewer_count
    AFTER INSERT OR UPDATE ON stream_viewers
    FOR EACH ROW EXECUTE FUNCTION update_stream_viewer_count();

-- Function to calculate stream duration
CREATE OR REPLACE FUNCTION calculate_stream_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ended' AND OLD.status = 'live' THEN
        NEW.end_time = NOW();
        NEW.duration = NEW.end_time - NEW.start_time;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for calculating stream duration
CREATE TRIGGER trigger_calculate_stream_duration
    BEFORE UPDATE ON streaming_sessions
    FOR EACH ROW EXECUTE FUNCTION calculate_stream_duration();

-- Insert sample streaming data
INSERT INTO streaming_sessions (
    title, description, status, start_time, quality, viewer_count, 
    peak_viewers, chat_enabled, recording_enabled, hybrid_mode, 
    in_person_attendance, created_by
) VALUES 
(
    'Culto Dominical - Manhã',
    'Celebração dominical com louvor, palavra e comunhão',
    'scheduled',
    NOW() + INTERVAL '2 hours',
    '1080p',
    0,
    0,
    true,
    true,
    true,
    0,
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'Vigília de Oração',
    'Noite de oração e intercessão pela igreja e nação',
    'ended',
    NOW() - INTERVAL '3 days',
    '720p',
    89,
    124,
    true,
    true,
    false,
    45,
    (SELECT id FROM auth.users LIMIT 1)
);

-- Insert sample chat messages
INSERT INTO stream_chat_messages (
    stream_id, user_name, message, message_type
) VALUES 
(
    (SELECT id FROM streaming_sessions WHERE title = 'Vigília de Oração'),
    'Maria Silva',
    'Glória a Deus! 🙏',
    'message'
),
(
    (SELECT id FROM streaming_sessions WHERE title = 'Vigília de Oração'),
    'João Santos',
    'Orando pela família Silva',
    'prayer'
);

-- Insert sample prayer requests
INSERT INTO stream_prayer_requests (
    stream_id, requester_name, prayer_request, prayer_count
) VALUES 
(
    (SELECT id FROM streaming_sessions WHERE title = 'Vigília de Oração'),
    'Ana Costa',
    'Oração pela saúde da minha mãe',
    15
),
(
    (SELECT id FROM streaming_sessions WHERE title = 'Vigília de Oração'),
    'Pedro Lima',
    'Sabedoria para decisões importantes',
    8
);

COMMIT;
