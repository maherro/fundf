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
    
    // Use a service that can convert HTML to markdown for easier parsing
    const response = await fetch('https://r.jina.ai/https://sa.investing.com/news/cryptocurrency-news', {
      headers: {
        'Accept': 'text/plain'
      }
    });
    const markdown = await response.text();
    
    console.log('Fetched markdown content, length:', markdown.length);
    
    // Parse the markdown to extract news articles
    const articles: NewsArticle[] = [];
    
    // Match pattern: - [title](url)\n\ndescription\n\n- بواسطةauthor•timeago
    const lines = markdown.split('\n');
    
    for (let i = 0; i < lines.length && articles.length < 12; i++) {
      const line = lines[i].trim();
      
      // Look for article links
      const linkMatch = line.match(/^-\s*\[(.*?)\]\((https:\/\/sa\.investing\.com\/news\/cryptocurrency-news\/article-\d+)\)/);
      
      if (linkMatch) {
        const title = linkMatch[1].trim();
        const url = linkMatch[2].trim();
        
        // Get description (line i+2, but skip if blank)
        let description = '';
        for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
          const potentialDesc = lines[j].trim();
          if (potentialDesc && !potentialDesc.startsWith('-') && !potentialDesc.startsWith('بواسطة')) {
            // Remove author prefix pattern like "Arincen - description"
            description = potentialDesc.replace(/^[A-Za-z]+\s*-\s*/, '');
            break;
          }
        }
        
        // Get author and time - look for the line with بواسطة pattern
        let author = 'Investing.com';
        let timeAgo = 'مؤخراً';
        
        for (let j = i + 1; j < i + 10 && j < lines.length; j++) {
          const potentialAuthor = lines[j].trim();
          const authorMatch = potentialAuthor.match(/^-\s*بواسطة(.*?)•(.*?)$/);
          if (authorMatch) {
            author = authorMatch[1].trim();
            timeAgo = authorMatch[2].trim();
            break;
          }
        }
        
        if (description) {
          articles.push({
            title,
            url,
            description: description.substring(0, 200),
            author,
            timeAgo,
          });
        }
      }
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
