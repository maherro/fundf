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

    const response = await fetch('https://sa.investing.com/rss/news_301.rss');
    if (!response.ok) {
      console.error(`Failed to fetch RSS: ${response.status}`);
      throw new Error(`Failed to fetch RSS: ${response.status}`);
    }

    const rssText = await response.text();
    console.log('Received RSS length:', rssText.length);

    const articles: NewsArticle[] = [];
    
    // Parse XML manually - items are between <item> and </item>
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(rssText)) !== null && articles.length < 5) {
      const itemContent = match[1];
      
      // Extract title (no CDATA in this feed)
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      const enclosureMatch = itemContent.match(/<enclosure url="(.*?)"/);
      
      if (!titleMatch || !linkMatch) continue;
      
      let title = titleMatch[1].trim();
      const url = linkMatch[1].trim();
      const timeAgo = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
      
      // Decode HTML entities
      title = title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
      
      // Create a simple description from the title
      const description = title.length > 100 ? title.substring(0, 100) + '...' : title;
      
      articles.push({ 
        title, 
        url, 
        description,
        timeAgo 
      });
      
      console.log(`Article ${articles.length}: ${title.substring(0, 60)}`);
    }

    console.log(`Parsed ${articles.length} articles from RSS`);

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
