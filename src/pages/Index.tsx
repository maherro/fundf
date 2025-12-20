import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Search, Scale, HandshakeIcon, CheckCircle2, CandlestickChart, Bitcoin, DollarSign, HeartCrack, Home, ShieldAlert, LineChart, MoreHorizontal, ArrowLeft, ArrowUp, MessageCircle, ExternalLink } from "lucide-react";
import { articles } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import logo from "@/assets/fundfixers-new-logo.png";
import withdrawal1 from "@/assets/gallery/withdrawal-1.jpg";
import withdrawal2 from "@/assets/gallery/withdrawal-2.jpg";
import withdrawal3 from "@/assets/gallery/withdrawal-3.jpg";
import withdrawal4 from "@/assets/gallery/withdrawal-4.jpg";
import withdrawal5 from "@/assets/gallery/withdrawal-5.jpg";
import withdrawal6 from "@/assets/gallery/withdrawal-6.jpg";
import withdrawal7 from "@/assets/gallery/withdrawal-7.jpg";
import withdrawal8 from "@/assets/gallery/withdrawal-8.jpg";
import withdrawal9 from "@/assets/gallery/withdrawal-9.jpg";
import ahmedImg from "@/assets/testimonials/ahmed.jpg";
import fatimaImg from "@/assets/testimonials/fatima.jpg";
import khalidImg from "@/assets/testimonials/khalid.jpg";
import abdullahImg from "@/assets/testimonials/abdullah.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const Index = () => {
  const galleryImages = [
    withdrawal1,
    withdrawal2,
    withdrawal3,
    withdrawal4,
    withdrawal5,
    withdrawal6,
    withdrawal7,
    withdrawal8,
    withdrawal9,
  ];

  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [cryptoNews, setCryptoNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetchCryptoNews();
  }, []);

  const fetchCryptoNews = async () => {
    try {
      setNewsLoading(true);
      const { data, error } = await supabase
        .from('crypto_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setCryptoNews(data || []);
    } catch (error) {
      console.error('Error fetching crypto news:', error);
    } finally {
      setNewsLoading(false);
    }
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

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "",
    email: "",
    amount: "",
    fraudulentCompany: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast.success("تم إرسال الطلب بنجاح! سنتواصل معك قريباً");
      setFormData({
        fullName: "",
        phone: "",
        country: "",
        email: "",
        amount: "",
        fraudulentCompany: "",
        description: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div className="min-h-screen bg-background font-cairo">
      {/* Header Navigation */}
      <header className="border-b border-border/30 bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <img src={logo} alt="FundFixers Logo" className="h-[65px] w-auto" />
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-semibold text-sm">
                من نحن؟
              </a>
              <a href="#gallery" className="text-foreground hover:text-primary transition-colors font-semibold text-sm">
                أموال استرجعت
              </a>
              <a href="#articles" className="text-foreground hover:text-primary transition-colors font-semibold text-sm">
                مقالات وأخبار
              </a>
              <a href="#scam-types" className="text-foreground hover:text-primary transition-colors font-semibold text-sm">
                بماذا نختص؟
              </a>
              <a href="#how-we-work" className="text-foreground hover:text-primary transition-colors font-semibold text-sm">
                كيف نعمل؟
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Side-by-Side Layout */}
      <section id="about" className="relative py-20 px-4 overflow-hidden">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Content */}
            <div className="space-y-8 lg:pt-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">منصة استرداد</span>
                <br />
                <span className="text-foreground">الخسائر المالية العالمية</span>
              </h1>

              <p className="text-foreground/90 text-lg md:text-xl leading-relaxed max-w-2xl">نحن مرخصون من قبل الهيئة الاستثمارية العالمية،
لنا صلاحية بكل ما يتعلق بالضرائب المحلية والعالمية والقوانين الاستثمارية و تم منح هذه الصلاحية من قبل صندوق البنك الدولي كمنصة لاسترداد الخسائر المالية للمتداولين وخسائر الأصول المتعددة.</p>

              <div className="space-y-3 p-6 rounded-lg bg-secondary/30 border border-border/30">
                <p className="font-semibold text-primary text-lg">الهيئة الاستثمارية العالمية</p>
                <p className="text-foreground/90">المقر الرئيسي - لندن بريطانيا - وزارة المالية</p>
                <p className="text-muted-foreground text-sm">
                  King Charles St, London SW1A 2AH, United Kingdom
                </p>
              </div>

              <p className="text-foreground/90 text-xl font-semibold">
                تواصل معنا - قدم شكوى ضد شركة تداول أو فوركس نصابة للمطالبة القانونية باسترجاع أموالك
              </p>
            </div>

            {/* Right Column - Form Card */}
            <div className="lg:sticky lg:top-8">
              <Card className="p-8 bg-card shadow-2xl border-0">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">ابدأ هنا</h2>
                  <p className="text-slate-900">احصل على استشارة مجانية</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-card-foreground font-semibold text-right text-sm">
                      الاسم الكامل *
                    </label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full text-right border-input/50 focus:border-primary transition-colors" placeholder="أدخل اسمك الكامل" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-card-foreground font-semibold text-right text-sm">
                      رقم الجوال *
                    </label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full text-right border-input/50 focus:border-primary transition-colors" placeholder="أدخل رقم الجوال" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-card-foreground font-semibold text-right text-sm">
                      الدولة *
                    </label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full text-right border-input/50 focus:border-primary transition-colors" placeholder="أدخل اسم الدولة" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-card-foreground font-semibold text-right text-sm">
                      البريد الإلكتروني *
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full text-right border-input/50 focus:border-primary transition-colors" placeholder="أدخل البريد الإلكتروني" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="amount" className="block text-card-foreground font-semibold text-right text-sm">
                      المبلغ *
                    </label>
                    <Input id="amount" name="amount" type="text" value={formData.amount} onChange={handleChange} required className="w-full text-right border-input/50 focus:border-primary transition-colors" placeholder="أدخل المبلغ المفقود" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fraudulentCompany" className="block text-card-foreground font-semibold text-right text-sm">
                      الشركة المحتالة *
                    </label>
                    <Input id="fraudulentCompany" name="fraudulentCompany" type="text" value={formData.fraudulentCompany} onChange={handleChange} required className="w-full text-right border-input/50 focus:border-primary transition-colors" placeholder="أدخل اسم الشركة المحتالة" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-card-foreground font-semibold text-right text-sm">
                      وصف الطلب او الحالة *
                    </label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full min-h-[120px] text-right border-input/50 focus:border-primary transition-colors" placeholder="اشرح حالتك بالتفصيل" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 bg-background" dir="rtl">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            قصص نجاح حقيقية
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            عملاء استعادوا أموالهم بمساعدتنا
          </p>

          <Carousel
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {[
                {
                  name: "أحمد السعيد",
                  country: "الإمارات",
                  amount: "15,400$",
                  days: 9,
                  date: "03/15/2025",
                  image: ahmedImg
                },
                {
                  name: "فاطمة الكعبة",
                  country: "قطر",
                  amount: "28,000$",
                  days: 16,
                  date: "02/22/2025",
                  image: fatimaImg
                },
                {
                  name: "خالد العلي",
                  country: "السعودية",
                  amount: "11,200$",
                  days: 12,
                  date: "04/08/2025",
                  image: khalidImg
                },
                {
                  name: "عبدالله المطيري",
                  country: "السعودية",
                  amount: "8,900$",
                  days: 8,
                  date: "05/12/2025",
                  image: abdullahImg
                }
              ].map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="p-6 space-y-4 bg-card hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start gap-4 flex-row-reverse">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-primary/20">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="font-bold text-lg text-card-foreground mb-1">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-primary flex items-center justify-end gap-1">
                            <span>{testimonial.country}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border/30">
                        <div className="flex justify-between items-center flex-row-reverse">
                          <span className="text-sm text-muted-foreground">
                            مبلغ الاسترجاع
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {testimonial.amount}
                          </span>
                        </div>

                        <div className="flex justify-between items-center flex-row-reverse">
                          <span className="text-sm text-muted-foreground">
                            الأيام المستغرقة
                          </span>
                          <span className="text-xl font-semibold text-card-foreground">
                            {testimonial.days}
                          </span>
                        </div>

                        <div className="flex justify-between items-center flex-row-reverse">
                          <span className="text-sm text-muted-foreground">
                            تاريخ الاسترجاع
                          </span>
                          <span className="text-sm text-card-foreground">
                            {testimonial.date}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="flex -left-2 md:-left-12" />
            <CarouselNext className="flex -right-2 md:-right-12" />
          </Carousel>
        </div>
      </section>

      {/* Gallery Slider Section */}
      <section id="gallery" className="py-20 px-4 bg-secondary/20">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            أموال استرجعت لزبائننا
          </h2>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <Card 
                      className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-105"
                      onClick={() => setSelectedGalleryImage(image)}
                    >
                      <div className="relative">
                        <img 
                          src={image} 
                          alt={`سحب معاملة ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* News Section */}
      <section id="articles" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            أخبار العملات الرقمية
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            آخر التحديثات والأخبار في عالم العملات الرقمية والبلوكتشين
          </p>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cryptoNews.slice(0, 3).map((news) => (
                  <Card 
                    key={news.id}
                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-card"
                  >
                    {news.image_url && (
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img 
                          src={news.image_url} 
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(news.published_at)}</span>
                      </div>
                      <h3 className="font-bold text-lg text-card-foreground text-right leading-relaxed line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground text-right text-sm line-clamp-3 leading-relaxed">
                        {news.description}
                      </p>
                      <a 
                        href={news.original_url}
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
              
              <div className="text-center mt-8">
                <Link to="/news">
                  <Button variant="default" size="lg" className="gap-2">
                    عرض المزيد من الأخبار
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/10 to-secondary/20">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            دليل المقالات
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            أدلة شاملة واستراتيجيات لحماية أموالك واسترجاعها
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.filter(a => a.category !== "أخبار وتنبيهات").slice(0, 3).map((article) => {
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

          <div className="text-center mt-12">
            <Link to="/articles">
              <Button size="lg" className="gap-2 px-8 py-6 text-lg">
                عرض جميع المقالات ({articles.length}) <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Types of Scams Section */}
      <section id="scam-types" className="py-20 px-4 bg-secondary/30">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            أنواع الاحتيال التي نساعدك في استرداد أموالك منها
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
            نتعامل مع جميع أنواع عمليات النصب والاحتيال المالي
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Binary Options */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <CandlestickChart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">الخيارات الثنائية</h3>
              </div>
            </Card>

            {/* Digital Currency */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Bitcoin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">العملات الرقمية</h3>
              </div>
            </Card>

            {/* Forex */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">الفوركس</h3>
              </div>
            </Card>

            {/* Romance Scams */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <HeartCrack className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">النصب العاطفي</h3>
              </div>
            </Card>

            {/* Property Scams */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">احتيال العقارات</h3>
              </div>
            </Card>

            {/* Credit Card Phishing */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ShieldAlert className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">سرقة البطاقات</h3>
              </div>
            </Card>

            {/* Stock Trading */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <LineChart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">تداول الأسهم</h3>
              </div>
            </Card>

            {/* Trading with Broker */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <HandshakeIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-card-foreground text-lg">التداول مع وسيط</h3>
              </div>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-lg mb-6">
              لم تجد نوع الاحتيال الذي تعرضت له؟ لا تقلق، نحن نتعامل مع جميع أنواع الاحتيال المالي
            </p>
            <Button 
              onClick={() => {
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline" 
              size="lg"
              className="text-lg px-8"
            >
              تواصل معنا الآن
            </Button>
          </div>
        </div>
      </section>

      {/* How We Do It Section */}
      <section id="how-we-work" className="py-20 px-4 bg-background">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              كيف نعمل؟
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              عملية بسيطة وشفافة لاسترداد أموالك المفقودة
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2 -z-10" />

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">تقديم الشكوى</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  املأ النموذج وقدم تفاصيل حالتك والشركة النصابة
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">المراجعة القانونية</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  فريقنا القانوني يراجع حالتك ويحدد أفضل الإجراءات
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Scale className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">التحقيق والتوثيق</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  جمع الأدلة والوثائق اللازمة للإجراءات القانونية
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <HandshakeIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">الإجراءات القانونية</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  نشرع باتخاذ الإجراءات القانونية الدولية اللازمة ضد الشركة أو الفرد المسؤول عن عملية الاحتيال
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center space-y-4 group">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    5
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">استرداد الأموال</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  نسترد أموالك ونعيدها إليك بشكل آمن وقانوني
                </p>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <Card className="mt-16 p-8 md:p-12 bg-success border-success/30">
            <div className="text-center space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-success-foreground">
                هل أنت مستعد لاسترداد أموالك؟
              </h3>
              <p className="text-success-foreground/90 text-lg max-w-2xl mx-auto">
                لا تدع المحتالين يفلتون بأموالك. ابدأ الآن واسترد حقوقك مع فريقنا القانوني المتخصص
              </p>
              <Button 
                onClick={() => {
                  document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ابدأ استرداد أموالك الآن
              </Button>
            </div>
          </Card>
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
                  <DialogTitle className="text-right text-2xl leading-relaxed flex-1">
                    {selectedArticle.title}
                  </DialogTitle>
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


      {/* Gallery Image Lightbox */}
      <Dialog open={!!selectedGalleryImage} onOpenChange={(open) => !open && setSelectedGalleryImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-0">
          <button
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 flex items-center justify-center group"
            aria-label="Close"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform duration-200">×</span>
          </button>
          {selectedGalleryImage && (
            <img
              src={selectedGalleryImage}
              alt="سحب معاملة"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;