import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowUp, MessageCircle, ArrowLeft, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/fundfixers-new-logo.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  author: string;
  timeAgo: string;
}

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleContent, setArticleContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fetch-crypto-news');
      
      if (error) throw error;
      
      if (data?.articles) {
        setNews(data.articles);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('فشل تحميل الأخبار');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchArticleContent = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setLoadingContent(true);
    setArticleContent("");

    try {
      const response = await fetch(`https://r.jina.ai/${article.url}`, {
        headers: { 'Accept': 'text/plain' }
      });
      const markdown = await response.text();
      setArticleContent(markdown);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('فشل تحميل المقال');
      setArticleContent('عذراً، حدث خطأ في تحميل المقال.');
    } finally {
      setLoadingContent(false);
    }
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    setArticleContent("");
  };

  const renderMarkdown = (content: string) => {
    return content.split('\n').map((line, idx) => {
      line = line.trim();
      
      if (!line) return null;
      
      // Headers
      if (line.startsWith('####')) {
        return <h4 key={idx} className="text-lg font-bold mt-6 mb-3 text-right">{line.replace(/^####\s*/, '')}</h4>;
      }
      if (line.startsWith('###')) {
        return <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-right">{line.replace(/^###\s*/, '')}</h3>;
      }
      if (line.startsWith('##')) {
        return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-right">{line.replace(/^##\s*/, '')}</h2>;
      }
      if (line.startsWith('#')) {
        return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 text-right">{line.replace(/^#\s*/, '')}</h1>;
      }
      
      // Lists
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return <li key={idx} className="mr-6 mb-2 text-right">{line.replace(/^[*-]\s*/, '')}</li>;
      }
      
      // Links - remove markdown link syntax
      line = line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
      
      // Bold text
      line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      // Regular paragraphs
      return <p key={idx} className="mb-4 leading-relaxed text-right" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <header className="border-b border-border/30 bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="FundFixers Logo" className="h-[65px] w-auto" />
            </Link>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            أخبار العملات الرقمية
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            آخر التحديثات والأخبار في عالم العملات الرقمية والبلوكتشين من Investing.com
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/5">
        <div className="container max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <Card 
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card cursor-pointer"
                  onClick={() => fetchArticleContent(article)}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Newspaper className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span>{article.timeAgo}</span>
                        <span>بواسطة {article.author}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-card-foreground text-right leading-relaxed line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-right text-sm line-clamp-3">
                      {article.description}
                    </p>
                    <Button variant="outline" className="w-full">
                      اقرأ المزيد
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">لا توجد أخبار متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/YOUR_PHONE_NUMBER"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && closeArticle()}>
        <DialogContent className="max-w-5xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-right text-2xl font-bold leading-relaxed pr-6">
              {selectedArticle?.title}
            </DialogTitle>
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 pr-6">
              <span>{selectedArticle?.timeAgo}</span>
              <span>بواسطة {selectedArticle?.author}</span>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-140px)] px-6">
            {loadingContent ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">جاري تحميل المقال...</p>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none text-foreground">
                {renderMarkdown(articleContent)}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;
