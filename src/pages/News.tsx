import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, ArrowUp, MessageCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/fundfixers-new-logo.png";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  author: string;
  timeAgo: string;
  image?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header */}
      <header className="border-b border-border/30 bg-background sticky top-0 z-50">
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
            آخر التحديثات والأخبار في عالم العملات الرقمية والبلوكتشين
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
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
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card"
                >
                  {article.image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>بواسطة {article.author}</span>
                      <span>{article.timeAgo}</span>
                    </div>
                    <h3 className="font-bold text-lg text-card-foreground text-right leading-relaxed line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-right text-sm line-clamp-3">
                      {article.description}
                    </p>
                    <a 
                      href={article.url}
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
    </div>
  );
};

export default News;
