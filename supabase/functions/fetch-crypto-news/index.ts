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
    
    console.log(`Total lines in markdown: ${lines.length}`);
    
    // Log the first 30 lines to see the structure
    console.log('=== First 30 lines of markdown ===');
    for (let i = 0; i < Math.min(30, lines.length); i++) {
      console.log(`Line ${i}: "${lines[i].substring(0, 100)}"`);
    }
    
    for (let i = 0; i < lines.length && articles.length < 12; i++) {
      const line = lines[i].trim();
      
      // Log lines that start with dash for debugging
      if (line.startsWith('-')) {
        console.log(`Line ${i} starts with dash: "${line.substring(0, 100)}..."`);
      }
      
      // Look for article links
      const linkMatch = line.match(/^-\s*\[(.*?)\]\((https:\/\/sa\.investing\.com\/news\/cryptocurrency-news\/article-\d+)\)/);
      
      if (linkMatch) {
        console.log(`Found article link at line ${i}: ${linkMatch[1].substring(0, 50)}...`);
        const title = linkMatch[1].trim();
        const url = linkMatch[2].trim();
        
        // Get description (look in next few lines)
        let description = '';
        for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
          const potentialDesc = lines[j].trim();
          console.log(`  Checking line ${j} for description: "${potentialDesc.substring(0, 50)}..."`);
          
          if (potentialDesc && !potentialDesc.startsWith('-') && !potentialDesc.includes('بواسطة')) {
            // Remove author prefix pattern like "Arincen - description"
            description = potentialDesc.replace(/^[A-Za-z]+\s*-\s*/, '');
            console.log(`  Found description: "${description.substring(0, 50)}..."`);
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
            console.log(`  Found author: ${author}, time: ${timeAgo}`);
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
          console.log(`  ✓ Article added! Total: ${articles.length}`);
        } else {
          console.log(`  ✗ Skipped - no description found`);
        }
      }
    }

    console.log(`Parsed ${articles.length} articles`);
    
    // Log first few article titles if any found
    if (articles.length > 0) {
      console.log('Sample articles:', articles.slice(0, 2).map(a => a.title));
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
