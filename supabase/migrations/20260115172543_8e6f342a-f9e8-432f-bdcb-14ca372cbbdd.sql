-- Add source column to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS source TEXT;