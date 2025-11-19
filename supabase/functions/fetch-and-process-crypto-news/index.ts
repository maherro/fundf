import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  timeAgo: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching cryptocurrency news RSS feed...');
    
    // Fetch RSS feed
    const response = await fetch('https://sa.investing.com/rss/news_301.rss');
    const rssText = await response.text();
    
    // Parse RSS feed
    const articles: NewsArticle[] = [];
    const itemMatches = rssText.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      if (articles.length >= 10) break;
      
      const itemContent = match[1];
      
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const descMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      
      if (titleMatch && linkMatch && descMatch) {
        const title = titleMatch[1].trim();
        const url = linkMatch[1].trim();
        let description = descMatch[1].trim();
        
        // Remove HTML tags from description
        description = description.replace(/<[^>]*>/g, '');
        
        // Limit description length
        if (description.length > 150) {
          description = description.substring(0, 150) + '...';
        }
        
        const timeAgo = pubDateMatch ? pubDateMatch[1] : 'مؤخراً';
        
        articles.push({ title, url, description, timeAgo });
      }
    }

    console.log(`Found ${articles.length} articles, processing...`);

    // Process each article: generate image only
    const processedArticles = [];
    for (const article of articles) {
      try {
        console.log(`Generating image for: ${article.title.substring(0, 50)}...`);
        
        // Generate AI image
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [
              {
                role: 'user',
                content: `Generate a modern, minimalistic cryptocurrency-themed image for this news article. Style: dark mode friendly, professional, abstract crypto symbols, blockchain network visualization. Theme: ${article.title.substring(0, 100)}`
              }
            ],
            modalities: ['image', 'text']
          })
        });

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          console.error('Failed to generate image for article:', article.title);
          continue;
        }

        // Parse publication date
        const publishedAt = new Date(article.timeAgo).toISOString();

        processedArticles.push({
          title: article.title,
          description: article.description,
          original_url: article.url,
          image_url: imageUrl,
          published_at: publishedAt
        });

        console.log(`Successfully processed: ${article.title.substring(0, 50)}...`);
        
      } catch (error) {
        console.error('Error processing article:', error);
      }
    }

    // Store in database
    console.log(`Storing ${processedArticles.length} articles in database...`);
    const { data, error } = await supabase
      .from('crypto_news')
      .insert(processedArticles)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Successfully stored ${data.length} articles`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: data.length,
        articles: data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-and-process-crypto-news:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
