-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  amount TEXT NOT NULL,
  fraudulent_company TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for contact form submissions)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read submissions
CREATE POLICY "Anyone can read submissions"
ON public.contact_submissions
FOR SELECT
USING (true);

-- Allow anyone to delete submissions
CREATE POLICY "Anyone can delete submissions"
ON public.contact_submissions
FOR DELETE
USING (true);