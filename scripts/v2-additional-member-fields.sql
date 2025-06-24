-- Migration: add extra date columns to members
-- Run this AFTER the original create-database-schema.sql

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS baptism_date DATE,
  ADD COLUMN IF NOT EXISTS membership_date DATE;
