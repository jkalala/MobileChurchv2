-- Insert sample data for testing the Smart Church Management App

-- Insert sample families
INSERT INTO families (id, family_name, address) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Johnson Family', '123 Grace Street, Nairobi, Kenya'),
('550e8400-e29b-41d4-a716-446655440002', 'Okafor Family', '456 Faith Avenue, Lagos, Nigeria'),
('550e8400-e29b-41d4-a716-446655440003', 'Mwangi Family', '789 Hope Road, Kampala, Uganda'),
('550e8400-e29b-41d4-a716-446655440004', 'Asante Family', '321 Love Lane, Accra, Ghana'),
('550e8400-e29b-41d4-a716-446655440005', 'Banda Family', '654 Peace Avenue, Lusaka, Zambia');

-- Insert sample members
INSERT INTO members (id, first_name, last_name, email, phone, date_of_birth, gender, family_id, member_status) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+254701234567', '1985-03-15', 'Female', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('550e8400-e29b-41d4-a716-446655440011', 'Michael', 'Okafor', 'michael.okafor@email.com', '+234801234567', '1978-07-22', 'Male', '550e8400-e29b-41d4-a716-446655440002', 'active'),
('550e8400-e29b-41d4-a716-446655440012', 'Grace', 'Mwangi', 'grace.mwangi@email.com', '+256701234567', '1990-11-08', 'Female', '550e8400-e29b-41d4-a716-446655440003', 'active'),
('550e8400-e29b-41d4-a716-446655440013', 'David', 'Asante', 'david.asante@email.com', '+233201234567', '1982-05-30', 'Male', '550e8400-e29b-41d4-a716-446655440004', 'active'),
('550e8400-e29b-41d4-a716-446655440014', 'Mary', 'Johnson', 'mary.johnson@email.com', '+254701234568', '2005-09-12', 'Female', '550e8400-e29b-41d4-a716-446655440001', 'active'),
('550e8400-e29b-41d4-a716-446655440015', 'Peter', 'Okafor', 'peter.okafor@email.com', '+234801234568', '2008-04-18', 'Male', '550e8400-e29b-41d4-a716-446655440002', 'active'),
('550e8400-e29b-41d4-a716-446655440016', 'Ruth', 'Banda', 'ruth.banda@email.com', '+260971234567', '1992-12-03', 'Female', '550e8400-e29b-41d4-a716-446655440005', 'active'),
('550e8400-e29b-41d4-a716-446655440017', 'James', 'Banda', 'james.banda@email.com', '+260971234568', '1988-06-25', 'Male', '550e8400-e29b-41d4-a716-446655440005', 'active');

-- Update family heads
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440010' WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440011' WHERE id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440012' WHERE id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440013' WHERE id = '550e8400-e29b-41d4-a716-446655440004';
UPDATE families SET head_of_family = '550e8400-e29b-41d4-a716-446655440017' WHERE id = '550e8400-e29b-41d4-a716-446655440005';

-- Insert sample ministries with leaders
INSERT INTO ministries (id, name, description, leader_id, budget_allocated, budget_spent) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'Youth Ministry', 'Ministry focused on young people and teenagers', '550e8400-e29b-41d4-a716-446655440011', 2000.00, 1800.00),
('550e8400-e29b-41d4-a716-446655440021', 'Choir Department', 'Music and worship ministry', '550e8400-e29b-41d4-a716-446655440010', 1500.00, 1350.00),
('550e8400-e29b-41d4-a716-446655440022', 'Sunday School', 'Children education and spiritual development', '550e8400-e29b-41d4-a716-446655440012', 1000.00, 650.00),
('550e8400-e29b-41d4-a716-446655440023', 'Outreach Program', 'Community service and evangelism', '550e8400-e29b-41d4-a716-446655440013', 2500.00, 1200.00),
('550e8400-e29b-41d4-a716-446655440024', 'Women''s Ministry', 'Fellowship and support for women', '550e8400-e29b-41d4-a716-446655440016', 800.00, 450.00);

-- Insert sample events
INSERT INTO events (id, title, description, event_date, start_time, end_time, location, event_type, max_capacity, ministry_id, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440030', 'Sunday Morning Service', 'Weekly worship service with communion', CURRENT_DATE + INTERVAL '7 days', '09:00', '11:00', 'Main Sanctuary', 'service', 500, '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440031', 'Youth Fellowship', 'Monthly youth gathering and Bible study', CURRENT_DATE + INTERVAL '10 days', '18:00', '20:00', 'Youth Hall', 'fellowship', 100, '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440032', 'Choir Practice', 'Weekly choir rehearsal for Sunday service', CURRENT_DATE + INTERVAL '3 days', '19:00', '21:00', 'Music Room', 'practice', 30, '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440033', 'Community Outreach', 'Food distribution to families in need', CURRENT_DATE + INTERVAL '14 days', '10:00', '16:00', 'Downtown Community Center', 'outreach', 50, '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440013'),
('550e8400-e29b-41d4-a716-446655440034', 'Women''s Prayer Meeting', 'Monthly women''s fellowship and prayer', CURRENT_DATE + INTERVAL '21 days', '14:00', '16:00', 'Fellowship Hall', 'fellowship', 60, '550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440016');

-- Insert sample financial transactions
INSERT INTO financial_transactions (member_id, amount, transaction_type, payment_method, ministry_id, notes) VALUES
('550e8400-e29b-41d4-a716-446655440010', 250.00, 'tithe', 'mpesa', NULL, 'Monthly tithe - January 2024'),
('550e8400-e29b-41d4-a716-446655440011', 180.00, 'tithe', 'mtn_money', NULL, 'Monthly tithe - January 2024'),
('550e8400-e29b-41d4-a716-446655440012', 320.00, 'tithe', 'cash', NULL, 'Monthly tithe - January 2024'),
('550e8400-e29b-41d4-a716-446655440013', 200.00, 'offering', 'airtel_money', '550e8400-e29b-41d4-a716-446655440023', 'Special offering for outreach'),
('550e8400-e29b-41d4-a716-446655440014', 50.00, 'offering', 'cash', '550e8400-e29b-41d4-a716-446655440020', 'Youth ministry support'),
('550e8400-e29b-41d4-a716-446655440015', 75.00, 'donation', 'mpesa', '550e8400-e29b-41d4-a716-446655440021', 'Choir equipment fund'),
('550e8400-e29b-41d4-a716-446655440016', 150.00, 'tithe', 'cash', NULL, 'Monthly tithe - January 2024'),
('550e8400-e29b-41d4-a716-446655440017', 300.00, 'tithe', 'mpesa', NULL, 'Monthly tithe - January 2024');

-- Insert sample attendance records
INSERT INTO attendance (member_id, event_id, check_in_time, attendance_type, notes) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440030', CURRENT_TIMESTAMP - INTERVAL '7 days', 'service', 'Present for Sunday service'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440030', CURRENT_TIMESTAMP - INTERVAL '7 days', 'service', 'Present for Sunday service'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440030', CURRENT_TIMESTAMP - INTERVAL '7 days', 'service', 'Present for Sunday service'),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440032', CURRENT_TIMESTAMP - INTERVAL '3 days', 'practice', 'Choir practice attendance'),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440032', CURRENT_TIMESTAMP - INTERVAL '3 days', 'practice', 'Choir practice attendance');

-- Insert sample choir members
INSERT INTO choir_members (member_id, voice_type, experience_level) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'soprano', 'advanced'),
('550e8400-e29b-41d4-a716-446655440012', 'alto', 'intermediate'),
('550e8400-e29b-41d4-a716-446655440011', 'tenor', 'advanced'),
('550e8400-e29b-41d4-a716-446655440013', 'bass', 'expert'),
('550e8400-e29b-41d4-a716-446655440016', 'soprano', 'intermediate'),
('550e8400-e29b-41d4-a716-446655440017', 'bass', 'advanced');

-- Insert sample sheet music
INSERT INTO sheet_music (title, composer, music_key, difficulty_level, duration, category, file_path, audio_file_path) VALUES
('Amazing Grace', 'John Newton', 'G Major', 'beginner', '00:04:30', 'hymn', '/music/amazing-grace.pdf', '/audio/amazing-grace.mp3'),
('How Great Thou Art', 'Carl Boberg', 'Bb Major', 'intermediate', '00:05:15', 'hymn', '/music/how-great-thou-art.pdf', '/audio/how-great-thou-art.mp3'),
('Blessed Assurance', 'Fanny Crosby', 'D Major', 'beginner', '00:03:45', 'hymn', '/music/blessed-assurance.pdf', NULL),
('Waymaker', 'Sinach', 'C Major', 'intermediate', '00:06:20', 'contemporary', '/music/waymaker.pdf', '/audio/waymaker.mp3'),
('Great Is Thy Faithfulness', 'Thomas Chisholm', 'F Major', 'intermediate', '00:04:50', 'hymn', '/music/great-is-thy-faithfulness.pdf', '/audio/great-is-thy-faithfulness.mp3');

-- Insert sample outreach projects
INSERT INTO outreach_projects (id, title, description, target_amount, current_amount, target_unit, start_date, end_date, location, coordinator_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440040', 'Food Distribution Drive', 'Monthly food distribution to families in need', 500, 350, 'kg food', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'Downtown Community Center', '550e8400-e29b-41d4-a716-446655440012', 'active'),
('550e8400-e29b-41d4-a716-446655440041', 'School Supplies Collection', 'Collecting school supplies for underprivileged children', 200, 145, 'supply kits', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '45 days', 'Local Primary Schools', '550e8400-e29b-41d4-a716-446655440011', 'active'),
('550e8400-e29b-41d4-a716-446655440042', 'Clean Water Initiative', 'Installing water filters in rural communities', 20, 20, 'filters', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '15 days', 'Rural Villages', '550e8400-e29b-41d4-a716-446655440013', 'completed');

-- Insert sample volunteer assignments
INSERT INTO volunteer_assignments (project_id, member_id, role, hours_committed, hours_completed) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440010', 'Food Coordinator', 20, 15),
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440011', 'Distribution Helper', 15, 12),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440012', 'Collection Organizer', 25, 18),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440013', 'Project Manager', 40, 40),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440017', 'Installation Technician', 30, 30);

-- Insert sample user achievements (using actual member IDs)
INSERT INTO user_achievements (member_id, achievement_type, achievement_name, achievement_description, points_earned, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'badge', 'Faithful Servant', '3-month tithing streak', 100, '{"streak_months": 3, "category": "giving"}'),
('550e8400-e29b-41d4-a716-446655440011', 'badge', 'Prayer Warrior', 'Attended 20 prayer meetings', 75, '{"meetings_attended": 20, "category": "spiritual"}'),
('550e8400-e29b-41d4-a716-446655440012', 'badge', 'Community Helper', '50 volunteer hours completed', 150, '{"hours_completed": 50, "category": "service"}'),
('550e8400-e29b-41d4-a716-446655440013', 'badge', 'Worship Leader', 'Led 10 worship sessions', 125, '{"sessions_led": 10, "category": "ministry"}'),
('550e8400-e29b-41d4-a716-446655440016', 'badge', 'Welcome Badge', 'Joined the church community', 50, '{"category": "milestone"}'),
('550e8400-e29b-41d4-a716-446655440017', 'badge', 'Volunteer Spirit', 'Completed first volunteer assignment', 75, '{"category": "service"}');

-- Insert sample user points (using actual member IDs)
INSERT INTO user_points (member_id, total_points, current_level, current_streak, longest_streak, last_activity_date) VALUES
('550e8400-e29b-41d4-a716-446655440010', 2450, 12, 12, 45, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440011', 1850, 9, 8, 32, CURRENT_DATE - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440012', 3200, 15, 25, 28, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440013', 2800, 13, 18, 25, CURRENT_DATE - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440016', 1200, 6, 5, 15, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440017', 1650, 8, 10, 22, CURRENT_DATE - INTERVAL '1 day');

-- Insert sample prayer requests (using actual member IDs)
INSERT INTO prayer_requests (member_id, title, description, request_type, privacy_level, status) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Healing for my mother', 'Please pray for my mother who is recovering from surgery', 'family', 'public', 'active'),
('550e8400-e29b-41d4-a716-446655440011', 'Job opportunity', 'Seeking God''s guidance for a new job opportunity', 'personal', 'public', 'active'),
('550e8400-e29b-41d4-a716-446655440012', 'Community outreach success', 'Pray for our upcoming food distribution event', 'community', 'public', 'active'),
('550e8400-e29b-41d4-a716-446655440013', 'Wisdom in leadership', 'Pray for wisdom as I lead the outreach ministry', 'ministry', 'ministry', 'active'),
('550e8400-e29b-41d4-a716-446655440016', 'Family unity', 'Pray for peace and unity in our family', 'family', 'public', 'active');

-- Insert sample event RSVPs
INSERT INTO event_rsvps (event_id, member_id, rsvp_status) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440011', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440012', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440014', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440015', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440010', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440012', 'confirmed');
