-- Create table for cryptocurrency news articles
CREATE TABLE public.crypto_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_url TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crypto_news ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view crypto news"
ON public.crypto_news
FOR SELECT
USING (true);

-- Create index for ordering by published date
CREATE INDEX idx_crypto_news_published_at ON public.crypto_news(published_at DESC);