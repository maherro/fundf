import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowUp, MessageCircle, Newspaper, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/fundfixers-new-logo.png";
import { Skeleton } from "@/components/ui/skeleton";

interface CryptoNews {
  id: string;
  title: string;
  description: string;
  original_url: string;
  image_url: string;
  published_at: string;
}

const News = () => {
  const [news, setNews] = useState<CryptoNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crypto_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setNews(data || []);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'منذ دقائق';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
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
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  الرئيسية
                </Button>
              </Link>
            </div>
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
            آخر التحديثات والأخبار في عالم العملات الرقمية والبلوكتشين
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/5">
        <div className="container max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">لا توجد أخبار متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article) => (
                <Card 
                  key={article.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card"
                >
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-card-foreground text-right leading-relaxed line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-right text-sm line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                    
                    <a 
                      href={article.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        اقرأ المزيد
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default News;
