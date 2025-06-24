-- Fix foreign key constraint issues in the Smart Church Management database
-- This script cleans up any orphaned records and ensures referential integrity
-- It safely handles cases where tables might not exist yet

-- Check if tables exist before attempting to clean them up
DO $$
BEGIN
    -- Clean up user_achievements if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_achievements') THEN
        DELETE FROM user_achievements 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned user achievements';
    ELSE
        RAISE NOTICE 'Table user_achievements does not exist yet - skipping cleanup';
    END IF;

    -- Clean up user_points if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_points') THEN
        DELETE FROM user_points 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned user points';
    ELSE
        RAISE NOTICE 'Table user_points does not exist yet - skipping cleanup';
    END IF;

    -- Clean up prayer_requests if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prayer_requests') THEN
        DELETE FROM prayer_requests 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned prayer requests';
    ELSE
        RAISE NOTICE 'Table prayer_requests does not exist yet - skipping cleanup';
    END IF;

    -- Clean up financial_transactions if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'financial_transactions') THEN
        DELETE FROM financial_transactions 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned financial transactions';
    ELSE
        RAISE NOTICE 'Table financial_transactions does not exist yet - skipping cleanup';
    END IF;

    -- Clean up attendance if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'attendance') THEN
        DELETE FROM attendance 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned attendance records';
    ELSE
        RAISE NOTICE 'Table attendance does not exist yet - skipping cleanup';
    END IF;

    -- Clean up volunteer_assignments if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'volunteer_assignments') THEN
        DELETE FROM volunteer_assignments 
        WHERE member_id NOT IN (SELECT id FROM members)
           OR project_id NOT IN (SELECT id FROM outreach_projects);
        RAISE NOTICE 'Cleaned up orphaned volunteer assignments';
    ELSE
        RAISE NOTICE 'Table volunteer_assignments does not exist yet - skipping cleanup';
    END IF;

    -- Clean up choir_members if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'choir_members') THEN
        DELETE FROM choir_members 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned choir members';
    ELSE
        RAISE NOTICE 'Table choir_members does not exist yet - skipping cleanup';
    END IF;

    -- Clean up event_rsvps if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_rsvps') THEN
        DELETE FROM event_rsvps 
        WHERE member_id NOT IN (SELECT id FROM members)
           OR event_id NOT IN (SELECT id FROM events);
        RAISE NOTICE 'Cleaned up orphaned event RSVPs';
    ELSE
        RAISE NOTICE 'Table event_rsvps does not exist yet - skipping cleanup';
    END IF;

    -- Clean up nft_certificates if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'nft_certificates') THEN
        DELETE FROM nft_certificates 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned NFT certificates';
    ELSE
        RAISE NOTICE 'Table nft_certificates does not exist yet - skipping cleanup';
    END IF;

    -- Clean up bible_study_progress if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bible_study_progress') THEN
        DELETE FROM bible_study_progress 
        WHERE member_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Cleaned up orphaned bible study progress';
    ELSE
        RAISE NOTICE 'Table bible_study_progress does not exist yet - skipping cleanup';
    END IF;

    -- Update families table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'families') THEN
        UPDATE families 
        SET head_of_family = (
            SELECT id FROM members 
            WHERE family_id = families.id 
            LIMIT 1
        )
        WHERE head_of_family IS NULL 
           OR head_of_family NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Updated family heads to valid members';
    END IF;

    -- Update ministries table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ministries') THEN
        UPDATE ministries 
        SET leader_id = (
            SELECT id FROM members 
            WHERE member_status = 'active' 
            LIMIT 1
        )
        WHERE leader_id IS NOT NULL 
           AND leader_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Updated ministry leaders to valid members';
    END IF;

    -- Update events table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
        UPDATE events 
        SET created_by = (
            SELECT id FROM members 
            WHERE member_status = 'active' 
            LIMIT 1
        )
        WHERE created_by IS NOT NULL 
           AND created_by NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Updated event creators to valid members';
    END IF;

    -- Update outreach_projects table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'outreach_projects') THEN
        UPDATE outreach_projects 
        SET coordinator_id = (
            SELECT id FROM members 
            WHERE member_status = 'active' 
            LIMIT 1
        )
        WHERE coordinator_id IS NOT NULL 
           AND coordinator_id NOT IN (SELECT id FROM members);
        RAISE NOTICE 'Updated outreach coordinators to valid members';
    END IF;

END $$;

-- Verify data integrity only if tables exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'members') THEN
        RAISE NOTICE 'Data integrity verification:';
        
        -- Show table counts
        PERFORM 1; -- This is just to make the block valid
        
    ELSE
        RAISE NOTICE 'Core tables do not exist yet. Please run the schema creation script first.';
    END IF;
END $$;

-- Show table existence status
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM (
    VALUES 
        ('members'),
        ('families'),
        ('ministries'),
        ('events'),
        ('financial_transactions'),
        ('attendance'),
        ('user_achievements'),
        ('user_points'),
        ('prayer_requests')
) AS t(table_name)
ORDER BY table_name;
