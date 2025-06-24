-- Fix streaming tables with proper stream key generation
-- This script fixes the NOT NULL constraint issue and adds proper sample data

-- First, let's drop and recreate the streaming_sessions table with better defaults
DROP TABLE IF EXISTS stream_moderators CASCADE;
DROP TABLE IF EXISTS stream_prayer_requests CASCADE;
DROP TABLE IF EXISTS stream_donations CASCADE;
DROP TABLE IF EXISTS hybrid_services CASCADE;
DROP TABLE IF EXISTS stream_viewers CASCADE;
DROP TABLE IF EXISTS stream_analytics CASCADE;
DROP TABLE IF EXISTS stream_chat_messages CASCADE;
DROP TABLE IF EXISTS streaming_sessions CASCADE;

-- Streaming sessions table with proper defaults
CREATE TABLE streaming_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    stream_key VARCHAR(255) UNIQUE NOT NULL DEFAULT ('sk_live_' || substr(gen_random_uuid()::text, 1, 8)),
    rtmp_url VARCHAR(500) DEFAULT 'rtmp://live.church.com/live',
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
CREATE TABLE stream_chat_messages (
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
CREATE TABLE stream_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2),
    metric_data JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stream viewers table (for tracking individual viewer sessions)
CREATE TABLE stream_viewers (
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
CREATE TABLE hybrid_services (
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
CREATE TABLE stream_donations (
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
CREATE TABLE stream_prayer_requests (
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
CREATE TABLE stream_moderators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stream_id UUID REFERENCES streaming_sessions(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES members(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"can_delete_messages": true, "can_timeout_users": true, "can_highlight_messages": true}',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_streaming_sessions_status ON streaming_sessions(status);
CREATE INDEX idx_streaming_sessions_created_at ON streaming_sessions(created_at);
CREATE INDEX idx_streaming_sessions_stream_key ON streaming_sessions(stream_key);
CREATE INDEX idx_stream_chat_messages_stream_id ON stream_chat_messages(stream_id);
CREATE INDEX idx_stream_chat_messages_created_at ON stream_chat_messages(created_at);
CREATE INDEX idx_stream_viewers_stream_id ON stream_viewers(stream_id);
CREATE INDEX idx_stream_analytics_stream_id ON stream_analytics(stream_id);
CREATE INDEX idx_hybrid_services_event_id ON hybrid_services(event_id);
CREATE INDEX idx_stream_donations_stream_id ON stream_donations(stream_id);
CREATE INDEX idx_stream_prayer_requests_stream_id ON stream_prayer_requests(stream_id);

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

-- Function to generate unique stream key
CREATE OR REPLACE FUNCTION generate_stream_key()
RETURNS TEXT AS $$
BEGIN
    RETURN 'sk_live_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
END;
$$ LANGUAGE plpgsql;

-- Insert sample streaming data with proper stream keys
DO $$
DECLARE
    sample_user_id UUID;
    stream_1_id UUID;
    stream_2_id UUID;
BEGIN
    -- Get a sample user ID (create one if none exists)
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    IF sample_user_id IS NULL THEN
        -- Create a sample user if none exists
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'admin@church.com',
            crypt('password123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        ) RETURNING id INTO sample_user_id;
    END IF;

    -- Insert sample streaming sessions
    INSERT INTO streaming_sessions (
        id, title, description, status, start_time, quality, viewer_count, 
        peak_viewers, chat_enabled, recording_enabled, hybrid_mode, 
        in_person_attendance, created_by, stream_key, rtmp_url
    ) VALUES 
    (
        gen_random_uuid(),
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
        sample_user_id,
        generate_stream_key(),
        'rtmp://live.church.com/live'
    ),
    (
        gen_random_uuid(),
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
        sample_user_id,
        generate_stream_key(),
        'rtmp://live.church.com/live'
    ) RETURNING id INTO stream_2_id;

    -- Get the stream IDs for sample data
    SELECT id INTO stream_1_id FROM streaming_sessions WHERE title = 'Culto Dominical - Manhã';
    SELECT id INTO stream_2_id FROM streaming_sessions WHERE title = 'Vigília de Oração';

    -- Insert sample chat messages
    INSERT INTO stream_chat_messages (
        stream_id, user_name, message, message_type
    ) VALUES 
    (
        stream_2_id,
        'Maria Silva',
        'Glória a Deus! 🙏',
        'message'
    ),
    (
        stream_2_id,
        'João Santos',
        'Orando pela família Silva',
        'prayer'
    ),
    (
        stream_2_id,
        'Ana Costa',
        'Amém! Palavra poderosa!',
        'message'
    ),
    (
        stream_2_id,
        'Pedro Lima',
        'Que benção este louvor!',
        'message'
    );

    -- Insert sample prayer requests
    INSERT INTO stream_prayer_requests (
        stream_id, requester_name, prayer_request, prayer_count
    ) VALUES 
    (
        stream_2_id,
        'Ana Costa',
        'Oração pela saúde da minha mãe',
        15
    ),
    (
        stream_2_id,
        'Pedro Lima',
        'Sabedoria para decisões importantes',
        8
    ),
    (
        stream_2_id,
        'Carla Santos',
        'Provisão financeira para a família',
        12
    );

    -- Insert sample donations
    INSERT INTO stream_donations (
        stream_id, donor_name, amount, currency, message, is_anonymous
    ) VALUES 
    (
        stream_2_id,
        'José Ferreira',
        500.00,
        'AOA',
        'Para a obra de Deus',
        false
    ),
    (
        stream_2_id,
        'Família Rodrigues',
        1000.00,
        'AOA',
        'Dízimo e oferta',
        false
    ),
    (
        stream_2_id,
        'Anônimo',
        250.00,
        'AOA',
        'Que Deus abençoe',
        true
    );

    -- Insert sample analytics
    INSERT INTO stream_analytics (
        stream_id, metric_name, metric_value, metric_data
    ) VALUES 
    (
        stream_2_id,
        'total_watch_time',
        7200.00,
        '{"unit": "seconds", "average_per_viewer": 4860}'
    ),
    (
        stream_2_id,
        'engagement_rate',
        0.85,
        '{"chat_messages": 45, "prayer_requests": 3, "donations": 3}'
    ),
    (
        stream_2_id,
        'device_breakdown',
        NULL,
        '{"mobile": 65, "desktop": 25, "tablet": 10}'
    );

    -- Insert sample viewers
    INSERT INTO stream_viewers (
        stream_id, device_type, location_country, location_city, 
        join_time, leave_time, watch_duration, quality_watched, engagement_score
    ) VALUES 
    (
        stream_2_id,
        'mobile',
        'Angola',
        'Luanda',
        NOW() - INTERVAL '3 days 2 hours',
        NOW() - INTERVAL '3 days 30 minutes',
        INTERVAL '1 hour 30 minutes',
        '720p',
        85
    ),
    (
        stream_2_id,
        'desktop',
        'Brasil',
        'São Paulo',
        NOW() - INTERVAL '3 days 2 hours',
        NOW() - INTERVAL '3 days 45 minutes',
        INTERVAL '1 hour 15 minutes',
        '1080p',
        92
    );

END $$;

-- Create a view for streaming dashboard
CREATE OR REPLACE VIEW streaming_dashboard AS
SELECT 
    s.id,
    s.title,
    s.description,
    s.status,
    s.start_time,
    s.end_time,
    s.duration,
    s.quality,
    s.viewer_count,
    s.peak_viewers,
    s.total_views,
    s.hybrid_mode,
    s.in_person_attendance,
    s.created_at,
    COALESCE(chat_stats.message_count, 0) as chat_messages,
    COALESCE(prayer_stats.prayer_count, 0) as prayer_requests,
    COALESCE(donation_stats.donation_count, 0) as donations,
    COALESCE(donation_stats.total_amount, 0) as total_donations
FROM streaming_sessions s
LEFT JOIN (
    SELECT stream_id, COUNT(*) as message_count
    FROM stream_chat_messages
    GROUP BY stream_id
) chat_stats ON s.id = chat_stats.stream_id
LEFT JOIN (
    SELECT stream_id, COUNT(*) as prayer_count
    FROM stream_prayer_requests
    GROUP BY stream_id
) prayer_stats ON s.id = prayer_stats.stream_id
LEFT JOIN (
    SELECT stream_id, COUNT(*) as donation_count, SUM(amount) as total_amount
    FROM stream_donations
    GROUP BY stream_id
) donation_stats ON s.id = donation_stats.stream_id;

COMMIT;
