import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, MessageCircle, ArrowUp } from "lucide-react";
import { articles, Article } from "@/data/articles";
import logo from "@/assets/fundfixers-new-logo.png";

const Articles = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  const categories = ["الكل", ...Array.from(new Set(articles.map(a => a.category)))];
  
  const filteredArticles = selectedCategory === "الكل" 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

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
            مكتبة المقالات والأخبار
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            مجموعة شاملة من المقالات والأدلة لمساعدتك في حماية أموالك واسترجاع حقوقك
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-secondary/20">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const Icon = article.icon;
              return (
                <Card 
                  key={article.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-card-foreground text-right leading-relaxed line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-right text-sm line-clamp-2">
                      {article.description}
                    </p>
                    <button 
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-semibold text-sm"
                    >
                      اقرأ المزيد <ArrowLeft className="w-4 h-4 mr-2" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">لا توجد مقالات في هذه الفئة</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-success border-y border-success/30">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-success-foreground">
            هل تعرضت للاحتيال؟
          </h2>
          <p className="text-xl text-success-foreground/90 mb-8">
            تواصل معنا الآن واحصل على استشارة مجانية لاسترداد أموالك
          </p>
          <Link to="/">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6">
              ابدأ الآن
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/30">
        <div className="container max-w-7xl mx-auto px-4">
          <p className="text-center text-muted-foreground">
            FundFixers © جميع الحقوق محفوظة
          </p>
        </div>
      </footer>

      {/* Article Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = selectedArticle.icon;
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                      {selectedArticle.category}
                    </span>
                    <DialogTitle className="text-2xl leading-relaxed mt-2">
                      {selectedArticle.title}
                    </DialogTitle>
                  </div>
                </div>
              </DialogHeader>
              <div className="prose prose-lg max-w-none text-right" dir="rtl">
                {selectedArticle.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-6 mb-4 text-foreground">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-4 mb-3 text-foreground">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="text-muted-foreground mr-6 mb-2">
                        {paragraph.replace('- ', '')}
                      </li>
                    );
                  } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <p key={index} className="font-bold text-foreground my-3">
                        {paragraph.replace(/\*\*/g, '')}
                      </p>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed left-6 bottom-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/YOUR_PHONE_NUMBER"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:animate-pulse" />
      </a>
    </div>
  );
};

export default Articles;
