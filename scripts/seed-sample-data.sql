-- Seed sample data for the Church Management System
-- This script populates the database with realistic sample data

-- Insert sample families
INSERT INTO families (id, family_name, address) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440001'::UUID, 'Johnson Family', '123 Grace Street, Nairobi'),
    ('550e8400-e29b-41d4-a716-446655440002'::UUID, 'Okafor Family', '456 Faith Avenue, Lagos'),
    ('550e8400-e29b-41d4-a716-446655440003'::UUID, 'Mwangi Family', '789 Hope Road, Kampala'),
    ('550e8400-e29b-41d4-a716-446655440004'::UUID, 'Asante Family', '321 Love Lane, Accra')
) AS v(id, family_name, address)
WHERE NOT EXISTS (SELECT 1 FROM families WHERE families.id = v.id);

-- Insert sample members
INSERT INTO members (id, first_name, last_name, email, phone, date_of_birth, gender, family_id, member_status) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+254701234567', '1985-03-15'::DATE, 'Female', '550e8400-e29b-41d4-a716-446655440001'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, 'Michael', 'Okafor', 'michael.okafor@email.com', '+234801234567', '1978-07-22'::DATE, 'Male', '550e8400-e29b-41d4-a716-446655440002'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, 'Grace', 'Mwangi', 'grace.mwangi@email.com', '+256701234567', '1990-11-08'::DATE, 'Female', '550e8400-e29b-41d4-a716-446655440003'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, 'David', 'Asante', 'david.asante@email.com', '+233201234567', '1982-05-30'::DATE, 'Male', '550e8400-e29b-41d4-a716-446655440004'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440014'::UUID, 'Mary', 'Johnson', 'mary.johnson@email.com', '+254701234568', '2005-09-12'::DATE, 'Female', '550e8400-e29b-41d4-a716-446655440001'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440015'::UUID, 'Peter', 'Okafor', 'peter.okafor@email.com', '+234801234568', '2008-04-18'::DATE, 'Male', '550e8400-e29b-41d4-a716-446655440002'::UUID, 'active')
) AS v(id, first_name, last_name, email, phone, date_of_birth, gender, family_id, member_status)
WHERE NOT EXISTS (SELECT 1 FROM members WHERE members.id = v.id);

-- Update family heads
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440010' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440011' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440012' WHERE id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440013' WHERE id = '550e8400-e29b-41d4-a716-446655440004';

-- Insert sample ministries
INSERT INTO ministries (id, name, description, leader_id, budget_allocated, budget_spent) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440020'::UUID, 'Youth Ministry', 'Ministry focused on young people and teenagers', '550e8400-e29b-41d4-a716-446655440011'::UUID, 2000.00, 1800.00),
    ('550e8400-e29b-41d4-a716-446655440021'::UUID, 'Choir Department', 'Music and worship ministry', '550e8400-e29b-41d4-a716-446655440010'::UUID, 1500.00, 1350.00),
    ('550e8400-e29b-41d4-a716-446655440022'::UUID, 'Sunday School', 'Children education and spiritual development', '550e8400-e29b-41d4-a716-446655440012'::UUID, 1000.00, 650.00),
    ('550e8400-e29b-41d4-a716-446655440023'::UUID, 'Outreach Program', 'Community service and evangelism', '550e8400-e29b-41d4-a716-446655440013'::UUID, 2500.00, 1200.00),
    ('550e8400-e29b-41d4-a716-446655440024'::UUID, 'Women''s Ministry', 'Fellowship and support for women', '550e8400-e29b-41d4-a716-446655440010'::UUID, 800.00, 450.00)
) AS v(id, name, description, leader_id, budget_allocated, budget_spent)
WHERE NOT EXISTS (SELECT 1 FROM ministries WHERE ministries.id = v.id);

-- Insert sample events
INSERT INTO events (id, title, description, event_date, start_time, end_time, location, event_type, max_capacity, ministry_id, created_by) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440030'::UUID, 'Sunday Morning Service', 'Weekly worship service with communion', CURRENT_DATE + INTERVAL '7 days', '09:00'::TIME, '11:00'::TIME, 'Main Sanctuary', 'service', 500, '550e8400-e29b-41d4-a716-446655440021'::UUID, '550e8400-e29b-41d4-a716-446655440010'::UUID),
    ('550e8400-e29b-41d4-a716-446655440031'::UUID, 'Youth Fellowship', 'Monthly youth gathering and Bible study', CURRENT_DATE + INTERVAL '10 days', '18:00'::TIME, '20:00'::TIME, 'Youth Hall', 'fellowship', 100, '550e8400-e29b-41d4-a716-446655440020'::UUID, '550e8400-e29b-41d4-a716-446655440011'::UUID),
    ('550e8400-e29b-41d4-a716-446655440032'::UUID, 'Choir Practice', 'Weekly choir rehearsal for Sunday service', CURRENT_DATE + INTERVAL '3 days', '19:00'::TIME, '21:00'::TIME, 'Music Room', 'practice', 30, '550e8400-e29b-41d4-a716-446655440021'::UUID, '550e8400-e29b-41d4-a716-446655440010'::UUID),
    ('550e8400-e29b-41d4-a716-446655440033'::UUID, 'Community Outreach', 'Food distribution to families in need', CURRENT_DATE + INTERVAL '14 days', '10:00'::TIME, '16:00'::TIME, 'Downtown Community Center', 'outreach', 50, '550e8400-e29b-41d4-a716-446655440023'::UUID, '550e8400-e29b-41d4-a716-446655440013'::UUID)
) AS v(id, title, description, event_date, start_time, end_time, location, event_type, max_capacity, ministry_id, created_by)
WHERE NOT EXISTS (SELECT 1 FROM events WHERE events.id = v.id);

-- Insert sample financial transactions
INSERT INTO financial_transactions (member_id, amount, transaction_type, payment_method, ministry_id, notes) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, 250.00, 'tithe', 'mpesa', NULL::UUID, 'Monthly tithe - January 2024'),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, 180.00, 'tithe', 'mtn_money', NULL::UUID, 'Monthly tithe - January 2024'),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, 320.00, 'tithe', 'cash', NULL::UUID, 'Monthly tithe - January 2024'),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, 200.00, 'offering', 'airtel_money', '550e8400-e29b-41d4-a716-446655440023'::UUID, 'Special offering for outreach'),
    ('550e8400-e29b-41d4-a716-446655440014'::UUID, 50.00, 'offering', 'cash', '550e8400-e29b-41d4-a716-446655440020'::UUID, 'Youth ministry support'),
    ('550e8400-e29b-41d4-a716-446655440015'::UUID, 75.00, 'donation', 'mpesa', '550e8400-e29b-41d4-a716-446655440021'::UUID, 'Choir equipment fund')
) AS v(member_id, amount, transaction_type, payment_method, ministry_id, notes)
WHERE NOT EXISTS (SELECT 1 FROM financial_transactions WHERE financial_transactions.member_id = v.member_id AND financial_transactions.amount = v.amount AND financial_transactions.notes = v.notes);

-- Insert sample attendance records
INSERT INTO attendance (member_id, event_id, check_in_time, attendance_type, notes) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, '550e8400-e29b-41d4-a716-446655440030'::UUID, CURRENT_TIMESTAMP - INTERVAL '7 days', 'service', 'Present for Sunday service'),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, '550e8400-e29b-41d4-a716-446655440030'::UUID, CURRENT_TIMESTAMP - INTERVAL '7 days', 'service', 'Present for Sunday service'),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, '550e8400-e29b-41d4-a716-446655440030'::UUID, CURRENT_TIMESTAMP - INTERVAL '7 days', 'service', 'Present for Sunday service'),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, '550e8400-e29b-41d4-a716-446655440032'::UUID, CURRENT_TIMESTAMP - INTERVAL '3 days', 'practice', 'Choir practice attendance'),
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, '550e8400-e29b-41d4-a716-446655440032'::UUID, CURRENT_TIMESTAMP - INTERVAL '3 days', 'practice', 'Choir practice attendance')
) AS v(member_id, event_id, check_in_time, attendance_type, notes)
WHERE NOT EXISTS (SELECT 1 FROM attendance WHERE attendance.member_id = v.member_id AND attendance.event_id = v.event_id);

-- Insert sample choir members
INSERT INTO choir_members (member_id, voice_type, experience_level) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, 'soprano', 'advanced'),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, 'alto', 'intermediate'),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, 'tenor', 'advanced'),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, 'bass', 'expert')
) AS v(member_id, voice_type, experience_level)
WHERE NOT EXISTS (SELECT 1 FROM choir_members WHERE choir_members.member_id = v.member_id);

-- Insert sample sheet music
INSERT INTO sheet_music (title, composer, music_key, difficulty_level, duration, category, file_path, audio_file_path) 
SELECT * FROM (VALUES
    ('Amazing Grace', 'John Newton', 'G Major', 'beginner', '00:04:30'::INTERVAL, 'hymn', '/music/amazing-grace.pdf', '/audio/amazing-grace.mp3'),
    ('How Great Thou Art', 'Carl Boberg', 'Bb Major', 'intermediate', '00:05:15'::INTERVAL, 'hymn', '/music/how-great-thou-art.pdf', '/audio/how-great-thou-art.mp3'),
    ('Blessed Assurance', 'Fanny Crosby', 'D Major', 'beginner', '00:03:45'::INTERVAL, 'hymn', '/music/blessed-assurance.pdf', NULL),
    ('Waymaker', 'Sinach', 'C Major', 'intermediate', '00:06:20'::INTERVAL, 'contemporary', '/music/waymaker.pdf', '/audio/waymaker.mp3'),
    ('Great Is Thy Faithfulness', 'Thomas Chisholm', 'F Major', 'intermediate', '00:04:50'::INTERVAL, 'hymn', '/music/great-is-thy-faithfulness.pdf', '/audio/great-is-thy-faithfulness.mp3')
) AS v(title, composer, music_key, difficulty_level, duration, category, file_path, audio_file_path)
WHERE NOT EXISTS (SELECT 1 FROM sheet_music WHERE sheet_music.title = v.title);

-- Insert sample outreach projects
INSERT INTO outreach_projects (id, title, description, target_amount, current_amount, target_unit, start_date, end_date, location, coordinator_id, status) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440040'::UUID, 'Food Distribution Drive', 'Monthly food distribution to families in need', 500, 350, 'kg food', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Downtown Community Center', '550e8400-e29b-41d4-a716-446655440012'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440041'::UUID, 'School Supplies Collection', 'Collecting school supplies for underprivileged children', 200, 145, 'supply kits', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '45 days', 'Local Primary Schools', '550e8400-e29b-41d4-a716-446655440011'::UUID, 'active'),
    ('550e8400-e29b-41d4-a716-446655440042'::UUID, 'Clean Water Initiative', 'Installing water filters in rural communities', 20, 20, 'filters', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '15 days', 'Rural Villages', '550e8400-e29b-41d4-a716-446655440013'::UUID, 'completed')
) AS v(id, title, description, target_amount, current_amount, target_unit, start_date, end_date, location, coordinator_id, status)
WHERE NOT EXISTS (SELECT 1 FROM outreach_projects WHERE outreach_projects.id = v.id);

-- Insert sample volunteer assignments
INSERT INTO volunteer_assignments (project_id, member_id, role, hours_committed, hours_completed) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440040'::UUID, '550e8400-e29b-41d4-a716-446655440010'::UUID, 'Food Coordinator', 20, 15),
    ('550e8400-e29b-41d4-a716-446655440040'::UUID, '550e8400-e29b-41d4-a716-446655440011'::UUID, 'Distribution Helper', 15, 12),
    ('550e8400-e29b-41d4-a716-446655440041'::UUID, '550e8400-e29b-41d4-a716-446655440012'::UUID, 'Collection Organizer', 25, 18),
    ('550e8400-e29b-41d4-a716-446655440042'::UUID, '550e8400-e29b-41d4-a716-446655440013'::UUID, 'Project Manager', 40, 40)
) AS v(project_id, member_id, role, hours_committed, hours_completed)
WHERE NOT EXISTS (SELECT 1 FROM volunteer_assignments WHERE volunteer_assignments.project_id = v.project_id AND volunteer_assignments.member_id = v.member_id);

-- Insert sample user achievements (using actual member IDs)
INSERT INTO user_achievements (member_id, achievement_type, achievement_name, achievement_description, points_earned, metadata) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, 'badge', 'Faithful Servant', '3-month tithing streak', 100, '{"streak_months": 3, "category": "giving"}'::JSONB),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, 'badge', 'Prayer Warrior', 'Attended 20 prayer meetings', 75, '{"meetings_attended": 20, "category": "spiritual"}'::JSONB),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, 'badge', 'Community Helper', '50 volunteer hours completed', 150, '{"hours_completed": 50, "category": "service"}'::JSONB),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, 'badge', 'Worship Leader', 'Led 10 worship sessions', 125, '{"sessions_led": 10, "category": "ministry"}'::JSONB)
) AS v(member_id, achievement_type, achievement_name, achievement_description, points_earned, metadata)
WHERE NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_achievements.member_id = v.member_id AND user_achievements.achievement_name = v.achievement_name);

-- Insert sample user points (using actual member IDs)
INSERT INTO user_points (member_id, total_points, current_level, current_streak, longest_streak, last_activity_date) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, 2450, 12, 12, 45, CURRENT_DATE),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, 1850, 9, 8, 32, CURRENT_DATE - INTERVAL '1 day'),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, 3200, 15, 25, 28, CURRENT_DATE),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, 2800, 13, 18, 25, CURRENT_DATE - INTERVAL '2 days')
) AS v(member_id, total_points, current_level, current_streak, longest_streak, last_activity_date)
WHERE NOT EXISTS (SELECT 1 FROM user_points WHERE user_points.member_id = v.member_id);

-- Insert sample prayer requests (using actual member IDs)
INSERT INTO prayer_requests (member_id, title, description, request_type, privacy_level, status) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440010'::UUID, 'Healing for my mother', 'Please pray for my mother who is recovering from surgery', 'family', 'public', 'active'),
    ('550e8400-e29b-41d4-a716-446655440011'::UUID, 'Job opportunity', 'Seeking God''s guidance for a new job opportunity', 'personal', 'public', 'active'),
    ('550e8400-e29b-41d4-a716-446655440012'::UUID, 'Community outreach success', 'Pray for our upcoming food distribution event', 'community', 'public', 'active'),
    ('550e8400-e29b-41d4-a716-446655440013'::UUID, 'Wisdom in leadership', 'Pray for wisdom as I lead the outreach ministry', 'ministry', 'ministry', 'active')
) AS v(member_id, title, description, request_type, privacy_level, status)
WHERE NOT EXISTS (SELECT 1 FROM prayer_requests WHERE prayer_requests.member_id = v.member_id AND prayer_requests.title = v.title);

-- Insert sample event RSVPs
INSERT INTO event_rsvps (event_id, member_id, rsvp_status) 
SELECT * FROM (VALUES
    ('550e8400-e29b-41d4-a716-446655440030'::UUID, '550e8400-e29b-41d4-a716-446655440010'::UUID, 'confirmed'),
    ('550e8400-e29b-41d4-a716-446655440030'::UUID, '550e8400-e29b-41d4-a716-446655440011'::UUID, 'confirmed'),
    ('550e8400-e29b-41d4-a716-446655440030'::UUID, '550e8400-e29b-41d4-a716-446655440012'::UUID, 'confirmed'),
    ('550e8400-e29b-41d4-a716-446655440031'::UUID, '550e8400-e29b-41d4-a716-446655440014'::UUID, 'confirmed'),
    ('550e8400-e29b-41d4-a716-446655440031'::UUID, '550e8400-e29b-41d4-a716-446655440015'::UUID, 'confirmed'),
    ('550e8400-e29b-41d4-a716-446655440032'::UUID, '550e8400-e29b-41d4-a716-446655440010'::UUID, 'confirmed'),
    ('550e8400-e29b-41d4-a716-446655440032'::UUID, '550e8400-e29b-41d4-a716-446655440012'::UUID, 'confirmed')
) AS v(event_id, member_id, rsvp_status)
WHERE NOT EXISTS (SELECT 1 FROM event_rsvps WHERE event_rsvps.event_id = v.event_id AND event_rsvps.member_id = v.member_id);

-- Show completion message
SELECT 'Sample data seeded successfully!' as message;

-- Show record counts
SELECT 
    'members' as table_name,
    COUNT(*) as record_count
FROM members
UNION ALL
SELECT 
    'families' as table_name,
    COUNT(*) as record_count
FROM families
UNION ALL
SELECT 
    'ministries' as table_name,
    COUNT(*) as record_count
FROM ministries
UNION ALL
SELECT 
    'events' as table_name,
    COUNT(*) as record_count
FROM events
UNION ALL
SELECT 
    'financial_transactions' as table_name,
    COUNT(*) as record_count
FROM financial_transactions
UNION ALL
SELECT 
    'attendance' as table_name,
    COUNT(*) as record_count
FROM attendance
UNION ALL
SELECT 
    'choir_members' as table_name,
    COUNT(*) as record_count
FROM choir_members
UNION ALL
SELECT 
    'sheet_music' as table_name,
    COUNT(*) as record_count
FROM sheet_music
UNION ALL
SELECT 
    'outreach_projects' as table_name,
    COUNT(*) as record_count
FROM outreach_projects
UNION ALL
SELECT 
    'volunteer_assignments' as table_name,
    COUNT(*) as record_count
FROM volunteer_assignments
UNION ALL
SELECT 
    'user_achievements' as table_name,
    COUNT(*) as record_count
FROM user_achievements
UNION ALL
SELECT 
    'user_points' as table_name,
    COUNT(*) as record_count
FROM user_points
UNION ALL
SELECT 
    'prayer_requests' as table_name,
    COUNT(*) as record_count
FROM prayer_requests
UNION ALL
SELECT 
    'event_rsvps' as table_name,
    COUNT(*) as record_count
FROM event_rsvps
ORDER BY table_name;
