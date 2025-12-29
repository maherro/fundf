ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS preferred_contact_day TEXT;

ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS preferred_contact_time TEXT;