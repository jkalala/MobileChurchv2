-- Migration: Insert initial features for feature management
INSERT INTO features (id, name, enabled, description, roles)
VALUES
  (gen_random_uuid(), 'analytics_dashboard', true, 'Modern analytics dashboard for church data.', ARRAY['admin','pastor','leader']),
  (gen_random_uuid(), 'user_invitations', true, 'Invite new users by email and manage onboarding.', ARRAY['admin']),
  (gen_random_uuid(), 'audit_logs', true, 'Track sensitive admin actions and changes.', ARRAY['admin']),
  (gen_random_uuid(), 'role_management', true, 'Manage user roles and permissions.', ARRAY['admin']),
  (gen_random_uuid(), 'feature_management', true, 'Enable or disable features for your church.', ARRAY['admin']),
  (gen_random_uuid(), 'community_forum', false, 'Enable a community forum for members.', ARRAY['admin','leader']),
  (gen_random_uuid(), 'mobile_pwa', false, 'Progressive Web App features for mobile users.', ARRAY['admin','member']),
  (gen_random_uuid(), 'notifications', true, 'Send email, SMS, and in-app notifications.', ARRAY['admin','pastor','leader']),
  (gen_random_uuid(), 'advanced_reporting', false, 'Custom reports and scheduled exports.', ARRAY['admin','treasurer']),
  (gen_random_uuid(), 'ai_tools', false, 'AI-powered tools for ministry and admin.', ARRAY['admin','pastor']); 