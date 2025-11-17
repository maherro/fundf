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
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching cryptocurrency news...');
    
    const response = await fetch('https://r.jina.ai/https://sa.investing.com/news/cryptocurrency-news', {
      headers: { 'Accept': 'text/plain' }
    });
    const markdown = await response.text();
    
    console.log('=== FULL MARKDOWN START ===');
    console.log(markdown);
    console.log('=== FULL MARKDOWN END ===');
    
    const articles: NewsArticle[] = [];
    const lines = markdown.split('\n');
    console.log(`Total lines in markdown: ${lines.length}`);
    
    for (let i = 0; i < lines.length && articles.length < 12; i++) {
      const line = lines[i].trim();
      
      // Look for article links with asterisk bullets (not dashes!)
      const linkMatch = line.match(/^\*\s+\[(.*?)\]\((https:\/\/sa\.investing\.com\/news\/cryptocurrency-news\/article-\d+)\)/);
      
      if (linkMatch) {
        const title = linkMatch[1].trim();
        const url = linkMatch[2].trim();
        
        // Skip if it's not a crypto article
        if (!title || title.length < 10) continue;
        
        // Get description from next non-empty line
        let description = '';
        for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
          const potentialDesc = lines[j].trim();
          if (potentialDesc && !potentialDesc.startsWith('*') && !potentialDesc.includes('بواسطة') && !potentialDesc.startsWith('#')) {
            description = potentialDesc.replace(/^[A-Za-z]+\s*-\s*/, '');
            break;
          }
        }
        
        // Get author and time
        let author = 'Investing.com';
        let timeAgo = 'مؤخراً';
        
        for (let j = i + 1; j < i + 10 && j < lines.length; j++) {
          const potentialAuthor = lines[j].trim();
          const authorMatch = potentialAuthor.match(/^\*\s*بواسطة(.*?)•(.*?)$/);
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

    console.log(`Found ${articles.length} articles`);

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
