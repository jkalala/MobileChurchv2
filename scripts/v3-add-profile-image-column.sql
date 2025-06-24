-- Migration: add profile_image column to members
-- Safe to run multiple times (IF NOT EXISTS)

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS profile_image TEXT;
