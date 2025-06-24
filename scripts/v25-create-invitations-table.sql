-- Migration: Create invitations table for user onboarding
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations (token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations (email);

-- TODO: Add RLS policies for invitations if needed 