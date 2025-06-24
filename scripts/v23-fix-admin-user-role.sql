-- Fix admin user role for joaquim.kalala@gmail.com
-- First, let's update the user profile to have admin role

-- Update the user profile to admin role
UPDATE user_profiles 
SET 
  role = 'admin',
  updated_at = NOW()
WHERE email = 'joaquim.kalala@gmail.com';

-- If the profile doesn't exist, create it
INSERT INTO user_profiles (
  id,
  user_id,
  email,
  first_name,
  last_name,
  role,
  church_name,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  auth.users.id,
  'joaquim.kalala@gmail.com',
  'Joaquim',
  'Kalala',
  'admin',
  'Igreja Semente Bendita',
  NOW(),
  NOW()
FROM auth.users 
WHERE auth.users.email = 'joaquim.kalala@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.email = 'joaquim.kalala@gmail.com'
);

-- Create admin permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, permission_type)
);

-- Grant all admin permissions to joaquim.kalala@gmail.com
INSERT INTO admin_permissions (user_id, permission_type, granted_at)
SELECT 
  auth.users.id,
  permission,
  NOW()
FROM auth.users,
UNNEST(ARRAY[
  'manage_users',
  'manage_finances',
  'manage_events',
  'manage_members',
  'manage_settings',
  'view_analytics',
  'manage_departments',
  'manage_streaming',
  'manage_pastoral_care',
  'super_admin'
]) AS permission
WHERE auth.users.email = 'joaquim.kalala@gmail.com'
ON CONFLICT (user_id, permission_type) DO NOTHING;

-- Enable RLS on admin_permissions
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_permissions
CREATE POLICY "Users can view their own permissions" ON admin_permissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );
