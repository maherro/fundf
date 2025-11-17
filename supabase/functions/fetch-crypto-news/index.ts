import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  author: string;
  timeAgo: string;
  image?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching cryptocurrency news...');
    
    const response = await fetch('https://sa.investing.com/news/cryptocurrency-news');
    const html = await response.text();
    
    // Parse the HTML to extract news articles
    const articles: NewsArticle[] = [];
    
    // Extract article blocks - looking for patterns in the HTML
    const articlePattern = /- \[(.*?)\]\((https:\/\/sa\.investing\.com\/news\/cryptocurrency-news\/article-\d+)\)\s+.*?\s+(.*?)\s+- بواسطة(.*?)•(.*?)(?=\n|$)/gs;
    
    let match;
    while ((match = articlePattern.exec(html)) !== null && articles.length < 12) {
      const [, title, url, description, author, timeAgo] = match;
      
      articles.push({
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        author: author.trim(),
        timeAgo: timeAgo.trim(),
      });
    }

    console.log(`Parsed ${articles.length} articles`);

    // Generate images for articles in background
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (LOVABLE_API_KEY && articles.length > 0) {
      // Generate images for each article
      const articlesWithImages = await Promise.all(
        articles.map(async (article) => {
          try {
            // Create a prompt based on the article title
            const imagePrompt = `Professional financial news illustration for: ${article.title}. Modern, clean, cryptocurrency and blockchain themed, high quality, 16:9 aspect ratio`;
            
            const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash-image-preview',
                messages: [
                  {
                    role: 'user',
                    content: imagePrompt
                  }
                ],
                modalities: ['image', 'text']
              }),
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
              
              if (imageUrl) {
                return { ...article, image: imageUrl };
              }
            }
          } catch (error) {
            console.error('Error generating image:', error);
          }
          
          return article;
        })
      );

      return new Response(
        JSON.stringify({ articles: articlesWithImages }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ articles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
