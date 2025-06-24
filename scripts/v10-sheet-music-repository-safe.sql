-- Sheet Music Repository Database Schema (Safe Version)
-- This script safely creates or updates tables for the church sheet music system

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS music_assignments CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS sheet_music CASCADE;
DROP TABLE IF EXISTS music_categories CASCADE;

-- Create music categories table
CREATE TABLE music_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sheet music table
CREATE TABLE sheet_music (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    composer VARCHAR(255),
    arranger VARCHAR(255),
    category_id UUID REFERENCES music_categories(id),
    key_signature VARCHAR(10),
    time_signature VARCHAR(10),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    voice_parts TEXT[], -- Array of voice parts: ['Soprano', 'Alto', 'Tenor', 'Bass']
    tempo_marking VARCHAR(100),
    duration_minutes INTEGER,
    sheet_music_url TEXT,
    audio_url TEXT,
    lyrics TEXT,
    notes TEXT,
    copyright_info TEXT,
    is_public_domain BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create practice sessions table
CREATE TABLE practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_music_id UUID REFERENCES sheet_music(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    notes TEXT,
    attendees TEXT[],
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create music assignments table (for linking music to services/events)
CREATE TABLE music_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_music_id UUID REFERENCES sheet_music(id) ON DELETE CASCADE,
    event_id UUID, -- References events table if it exists
    service_date DATE,
    service_type VARCHAR(100),
    position_in_service INTEGER,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Insert music categories
INSERT INTO music_categories (name, description, color) VALUES
('Hymns', 'Traditional church hymns', '#8B5CF6'),
('Contemporary', 'Modern worship songs', '#10B981'),
('Gospel', 'Gospel and spiritual songs', '#F59E0B'),
('Christmas', 'Christmas and Advent music', '#EF4444'),
('Easter', 'Easter and resurrection songs', '#F97316'),
('Praise', 'Praise and celebration songs', '#06B6D4'),
('Communion', 'Songs for communion service', '#84CC16'),
('Prayer', 'Prayer and meditation songs', '#6366F1');

-- Insert sample sheet music
INSERT INTO sheet_music (title, composer, category_id, key_signature, difficulty_level, voice_parts, sheet_music_url, audio_url, lyrics, is_public_domain, tags) 
SELECT 
    title, composer, cat.id, key_signature, difficulty_level, voice_parts, sheet_music_url, audio_url, lyrics, is_public_domain, tags
FROM (VALUES
    -- Hymns
    ('Amazing Grace', 'John Newton', 'Hymns', 'G Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/amazing-grace.pdf', '/music/audio/amazing-grace.mp3', 'Amazing grace how sweet the sound, that saved a wretch like me...', true, ARRAY['grace', 'salvation', 'classic']),
    ('How Great Thou Art', 'Carl Boberg', 'Hymns', 'Bb Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/how-great-thou-art.pdf', '/music/audio/how-great-thou-art.mp3', 'O Lord my God, when I in awesome wonder...', true, ARRAY['worship', 'creation', 'praise']),
    ('Holy, Holy, Holy', 'Reginald Heber', 'Hymns', 'Eb Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/holy-holy-holy.pdf', '/music/audio/holy-holy-holy.mp3', 'Holy, holy, holy! Lord God Almighty!', true, ARRAY['trinity', 'worship', 'morning']),
    ('Be Thou My Vision', 'Irish Traditional', 'Hymns', 'D Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/be-thou-my-vision.pdf', '/music/audio/be-thou-my-vision.mp3', 'Be Thou my vision, O Lord of my heart...', true, ARRAY['guidance', 'prayer', 'celtic']),
    ('It Is Well With My Soul', 'Horatio Spafford', 'Hymns', 'C Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/it-is-well.pdf', '/music/audio/it-is-well.mp3', 'When peace like a river attendeth my way...', true, ARRAY['peace', 'comfort', 'trust']),
    
    -- Contemporary
    ('10,000 Reasons', 'Matt Redman', 'Contemporary', 'G Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/10000-reasons.pdf', '/music/audio/10000-reasons.mp3', 'Bless the Lord, O my soul, O my soul...', false, ARRAY['praise', 'blessing', 'modern']),
    ('Blessed Be Your Name', 'Matt Redman', 'Contemporary', 'A Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/blessed-be-your-name.pdf', '/music/audio/blessed-be-your-name.mp3', 'Blessed be Your name in the land that is plentiful...', false, ARRAY['worship', 'trials', 'faith']),
    ('How He Loves', 'John Mark McMillan', 'Contemporary', 'C Major', 'Advanced', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/how-he-loves.pdf', '/music/audio/how-he-loves.mp3', 'He is jealous for me, loves like a hurricane...', false, ARRAY['love', 'passion', 'grace']),
    ('Good Good Father', 'Chris Tomlin', 'Contemporary', 'F Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/good-good-father.pdf', '/music/audio/good-good-father.mp3', 'I''ve heard a thousand stories of what they think You''re like...', false, ARRAY['father', 'love', 'identity']),
    ('What a Beautiful Name', 'Hillsong Worship', 'Contemporary', 'D Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/what-a-beautiful-name.pdf', '/music/audio/what-a-beautiful-name.mp3', 'You were the Word at the beginning...', false, ARRAY['jesus', 'name', 'power']),
    
    -- Gospel
    ('Precious Lord', 'Thomas Dorsey', 'Gospel', 'F Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/precious-lord.pdf', '/music/audio/precious-lord.mp3', 'Precious Lord, take my hand, lead me on, let me stand...', true, ARRAY['comfort', 'guidance', 'traditional']),
    ('Wade in the Water', 'Traditional Spiritual', 'Gospel', 'G Minor', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/wade-in-the-water.pdf', '/music/audio/wade-in-the-water.mp3', 'Wade in the water, wade in the water children...', true, ARRAY['baptism', 'spiritual', 'freedom']),
    ('Swing Low, Sweet Chariot', 'Traditional Spiritual', 'Gospel', 'F Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/swing-low.pdf', '/music/audio/swing-low.mp3', 'Swing low, sweet chariot, coming for to carry me home...', true, ARRAY['heaven', 'spiritual', 'hope']),
    ('Go Tell It on the Mountain', 'Traditional Spiritual', 'Gospel', 'G Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/go-tell-it.pdf', '/music/audio/go-tell-it.mp3', 'Go tell it on the mountain, over the hills and everywhere...', true, ARRAY['christmas', 'evangelism', 'joy']),
    
    -- Christmas
    ('Silent Night', 'Franz Gruber', 'Christmas', 'C Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/silent-night.pdf', '/music/audio/silent-night.mp3', 'Silent night, holy night, all is calm, all is bright...', true, ARRAY['christmas', 'peace', 'nativity']),
    ('O Holy Night', 'Adolphe Adam', 'Christmas', 'C Major', 'Advanced', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/o-holy-night.pdf', '/music/audio/o-holy-night.mp3', 'O holy night, the stars are brightly shining...', true, ARRAY['christmas', 'nativity', 'worship']),
    ('Joy to the World', 'Isaac Watts', 'Christmas', 'D Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/joy-to-the-world.pdf', '/music/audio/joy-to-the-world.mp3', 'Joy to the world, the Lord is come...', true, ARRAY['christmas', 'joy', 'celebration']),
    ('The First Noel', 'Traditional English', 'Christmas', 'D Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/first-noel.pdf', '/music/audio/first-noel.mp3', 'The first Noel the angel did say...', true, ARRAY['christmas', 'nativity', 'angels']),
    
    -- Easter
    ('Christ the Lord Is Risen Today', 'Charles Wesley', 'Easter', 'C Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/christ-the-lord-risen.pdf', '/music/audio/christ-the-lord-risen.mp3', 'Christ the Lord is risen today, Alleluia!', true, ARRAY['easter', 'resurrection', 'victory']),
    ('Because He Lives', 'Bill Gaither', 'Easter', 'Bb Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/because-he-lives.pdf', '/music/audio/because-he-lives.mp3', 'God sent His son, they called Him Jesus...', false, ARRAY['easter', 'hope', 'life']),
    ('Up from the Grave He Arose', 'Robert Lowry', 'Easter', 'Ab Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/up-from-the-grave.pdf', '/music/audio/up-from-the-grave.mp3', 'Low in the grave He lay, Jesus my Savior...', true, ARRAY['easter', 'resurrection', 'victory']),
    
    -- Praise
    ('Shout to the Lord', 'Darlene Zschech', 'Praise', 'D Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/shout-to-the-lord.pdf', '/music/audio/shout-to-the-lord.mp3', 'My Jesus, my Savior, Lord there is none like You...', false, ARRAY['praise', 'worship', 'celebration']),
    ('Lord, I Lift Your Name on High', 'Rick Founds', 'Praise', 'G Major', 'Beginner', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/lord-i-lift-your-name.pdf', '/music/audio/lord-i-lift-your-name.mp3', 'Lord, I lift Your name on high...', false, ARRAY['praise', 'worship', 'simple']),
    ('Awesome God', 'Rich Mullins', 'Praise', 'A Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/awesome-god.pdf', '/music/audio/awesome-god.mp3', 'Our God is an awesome God...', false, ARRAY['praise', 'power', 'majesty']),
    
    -- Communion
    ('Here Is Love', 'William Rees', 'Communion', 'F Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/here-is-love.pdf', '/music/audio/here-is-love.mp3', 'Here is love vast as the ocean...', true, ARRAY['communion', 'love', 'sacrifice']),
    ('When I Survey the Wondrous Cross', 'Isaac Watts', 'Communion', 'Eb Major', 'Intermediate', ARRAY['Soprano', 'Alto', 'Tenor', 'Bass'], '/music/sheets/when-i-survey.pdf', '/music/audio/when-i-survey.mp3', 'When I survey the wondrous cross...', true, ARRAY['communion', 'cross', 'sacrifice'])
) AS songs(title, composer, category_name, key_signature, difficulty_level, voice_parts, sheet_music_url, audio_url, lyrics, is_public_domain, tags)
JOIN music_categories cat ON cat.name = songs.category_name;

-- Create indexes for better performance
CREATE INDEX idx_sheet_music_category ON sheet_music(category_id);
CREATE INDEX idx_sheet_music_difficulty ON sheet_music(difficulty_level);
CREATE INDEX idx_sheet_music_key ON sheet_music(key_signature);
CREATE INDEX idx_sheet_music_title ON sheet_music(title);
CREATE INDEX idx_practice_sessions_date ON practice_sessions(session_date);
CREATE INDEX idx_music_assignments_date ON music_assignments(service_date);

-- Enable Row Level Security
ALTER TABLE music_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Music categories are viewable by everyone" ON music_categories FOR SELECT USING (true);
CREATE POLICY "Sheet music is viewable by everyone" ON sheet_music FOR SELECT USING (true);
CREATE POLICY "Practice sessions are viewable by everyone" ON practice_sessions FOR SELECT USING (true);
CREATE POLICY "Music assignments are viewable by everyone" ON music_assignments FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can manage music categories" ON music_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage sheet music" ON sheet_music FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage practice sessions" ON practice_sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage music assignments" ON music_assignments FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sheet_music table
CREATE TRIGGER update_sheet_music_updated_at BEFORE UPDATE ON sheet_music FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
