-- Migration: Sync all features from DEFAULT_FEATURES into the features table
-- Only insert if not already present (by name)

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Member Management', true, 'Manage church members, profiles, and attendance', ARRAY['admin','pastor','leader']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Member Management');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Event Management', true, 'Create and manage church events and activities', ARRAY['admin','pastor','leader']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Event Management');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Financial Management', true, 'Track donations, tithes, and church finances', ARRAY['admin','treasurer']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Financial Management');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Pastoral Care', false, 'Member care, prayer requests, and pastoral support', ARRAY['admin','pastor']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Pastoral Care');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Music Ministry', false, 'Choir management and music planning tools', ARRAY['admin','music']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Music Ministry');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Live Streaming', false, 'Stream services and manage online congregation', ARRAY['admin','media']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Live Streaming');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Bible Study Tools', false, 'Interactive Bible study and devotional tools', ARRAY['admin','pastor','leader']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Bible Study Tools');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Communication Tools', false, 'SMS, email, and notification systems', ARRAY['admin','pastor','leader']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Communication Tools');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Outreach CRM', false, 'Community outreach and relationship management', ARRAY['admin','outreach']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Outreach CRM');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Reporting & Analytics', false, 'Advanced reports and church analytics', ARRAY['admin','treasurer']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Reporting & Analytics');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Department Management', false, 'Organize and manage church departments', ARRAY['admin','leader']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Department Management');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'AI Assistant', false, 'AI-powered church management assistance', ARRAY['admin']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'AI Assistant');

INSERT INTO features (id, name, enabled, description, roles)
SELECT gen_random_uuid(), 'Face Recognition', false, 'Automated attendance tracking with facial recognition', ARRAY['admin']
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Face Recognition'); 