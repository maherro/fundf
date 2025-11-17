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
      headers: { 'Accept': 'text/plain' }
    });
    const markdown = await response.text();
    
    // Parse articles from markdown
    const articles: NewsArticle[] = [];
    const lines = markdown.split('\n');
    
    for (let i = 0; i < lines.length && articles.length < 10; i++) {
      const line = lines[i].trim();
      const linkMatch = line.match(/^\*\s+\[(.*?)\]\((https:\/\/sa\.investing\.com\/news\/cryptocurrency-news\/article-\d+)\)/);
      
      if (linkMatch) {
        const title = linkMatch[1].trim();
        const url = linkMatch[2].trim();
        
        if (!title || title.length < 10) continue;
        
        let description = '';
        for (let j = i + 1; j < i + 5 && j < lines.length; j++) {
          const potentialDesc = lines[j].trim();
          if (potentialDesc && !potentialDesc.startsWith('*') && !potentialDesc.includes('بواسطة') && !potentialDesc.startsWith('#')) {
            description = potentialDesc.replace(/^[A-Za-z]+\s*-\s*/, '');
            break;
          }
        }
        
        let timeAgo = 'مؤخراً';
        for (let j = i + 1; j < i + 10 && j < lines.length; j++) {
          const potentialAuthor = lines[j].trim();
          const authorMatch = potentialAuthor.match(/^\*\s*بواسطة.*?•(.*?)$/);
          if (authorMatch) {
            timeAgo = authorMatch[1].trim();
            break;
          }
        }
        
        if (description) {
          articles.push({ title, url, description: description.substring(0, 150), timeAgo });
        }
      }
    }

    console.log(`Found ${articles.length} articles, processing...`);

    // Process each article: rewrite content and generate image
    const processedArticles = [];
    for (const article of articles) {
      try {
        // Rewrite title and description in formal Arabic
        console.log(`Rewriting article: ${article.title.substring(0, 50)}...`);
        const rewriteResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'أنت كاتب أخبار محترف في مجال العملات الرقمية. أعد كتابة الأخبار بالعربية الفصحى بأسلوب احترافي وموضوعي، دون ذكر أي مصادر خارجية. اجعل النص يبدو وكأنه محتوى أصلي ينتمي لموقعنا.'
              },
              {
                role: 'user',
                content: `أعد كتابة هذا الخبر بالعربية الفصحى (العنوان والوصف):

العنوان: ${article.title}
الوصف: ${article.description}

اكتب العنوان في سطر واحد، ثم الوصف في 20-25 كلمة. استخدم هذا التنسيق:
العنوان: [العنوان المعاد كتابته]
الوصف: [الوصف المعاد كتابته]`
              }
            ]
          })
        });

        const rewriteData = await rewriteResponse.json();
        const rewrittenText = rewriteData.choices[0].message.content;
        
        // Parse rewritten title and description
        const titleMatch = rewrittenText.match(/العنوان:\s*(.+)/);
        const descMatch = rewrittenText.match(/الوصف:\s*(.+)/);
        
        const newTitle = titleMatch ? titleMatch[1].trim() : article.title;
        const newDescription = descMatch ? descMatch[1].trim() : article.description;

        console.log(`Generating image for: ${newTitle.substring(0, 50)}...`);
        
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
                content: `Generate a modern, minimalistic cryptocurrency-themed image for this news article. Style: dark mode friendly, professional, abstract crypto symbols, blockchain network visualization. Theme: ${newTitle.substring(0, 100)}`
              }
            ],
            modalities: ['image', 'text']
          })
        });

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          console.error('Failed to generate image for article:', newTitle);
          continue;
        }

        // Parse time and convert to timestamp
        const publishedAt = new Date().toISOString();

        processedArticles.push({
          title: newTitle,
          description: newDescription,
          original_url: article.url,
          image_url: imageUrl,
          published_at: publishedAt
        });

        console.log(`Successfully processed: ${newTitle.substring(0, 50)}...`);
        
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
