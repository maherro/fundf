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

    console.log('Fetching cryptocurrency news from Investing.com...');
    
    // Fetch news using Jina AI reader
    const response = await fetch('https://r.jina.ai/https://sa.investing.com/news/cryptocurrency-news', {
      headers: { 
        'Accept': 'text/plain'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch news: ${response.status}`);
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    
    const markdown = await response.text();
    console.log('Received markdown length:', markdown.length);
    console.log('First 500 chars:', markdown.substring(0, 500));
    
    const articles: NewsArticle[] = [];
    const lines = markdown.split('\n');
    console.log('Total lines:', lines.length);
    
    for (let i = 0; i < lines.length && articles.length < 10; i++) {
      const line = lines[i].trim();
      
      // Look for article links in markdown format
      const linkMatch = line.match(/\[([^\]]+)\]\((https:\/\/sa\.investing\.com\/news\/cryptocurrency-news\/[^\)]+)\)/);
      
      if (linkMatch) {
        console.log('Found article link:', linkMatch[1].substring(0, 50));
        const title = linkMatch[1].trim();
        const url = linkMatch[2].trim();
        
        if (!title || title.length < 10) {
          console.log('Title too short, skipping');
          continue;
        }
        
        // Get description from next few lines
        let description = '';
        for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
          const potentialDesc = lines[j].trim();
          if (potentialDesc && 
              !potentialDesc.startsWith('*') && 
              !potentialDesc.startsWith('[') &&
              !potentialDesc.startsWith('#') &&
              !potentialDesc.includes('بواسطة')) {
            description = potentialDesc;
            console.log('Found description:', description.substring(0, 50));
            break;
          }
        }
        
        // Get time from metadata
        let timeAgo = 'مؤخراً';
        for (let j = i + 1; j < i + 10 && j < lines.length; j++) {
          const timeLine = lines[j].trim();
          if (timeLine.includes('•')) {
            const timeMatch = timeLine.match(/•\s*(.+)$/);
            if (timeMatch) {
              timeAgo = timeMatch[1].trim();
              break;
            }
          }
        }
        
        if (description && description.length > 20) {
          articles.push({ 
            title, 
            url, 
            description: description.substring(0, 150),
            timeAgo 
          });
          console.log(`Added article ${articles.length}:`, title.substring(0, 50));
        } else {
          console.log('Description too short or missing');
        }
      }
    }
    
    console.log(`Found ${articles.length} articles total`);

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
