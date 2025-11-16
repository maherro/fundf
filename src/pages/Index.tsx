import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/fundfixers-new-logo.png";
import withdrawal1 from "@/assets/gallery/real-withdrawal-1.jpg";
import withdrawal2 from "@/assets/gallery/real-withdrawal-2.webp";
import withdrawal3 from "@/assets/gallery/real-withdrawal-3.png";
import withdrawal4 from "@/assets/gallery/real-withdrawal-4.png";
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
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    country: "",
    email: "",
    description: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال الطلب بنجاح");
    setFormData({
      fullName: "",
      phone: "",
      country: "",
      email: "",
      description: ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen bg-background font-cairo">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img src={logo} alt="FundFixers Logo" className="h-[65px] w-auto" />
          </div>
        </div>
      </header>

      {/* Hero Section with Side-by-Side Layout */}
      <section className="relative py-20 px-4 overflow-hidden">
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
                    <label htmlFor="description" className="block text-card-foreground font-semibold text-right text-sm">
                      وصف الطلب او الحالة *
                    </label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full min-h-[120px] text-right border-input/50 focus:border-primary transition-colors" placeholder="اشرح حالتك بالتفصيل" />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    إرسال الطلب
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Slider Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            لمحة من اعادة أموال لزبائننا
          </h2>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <img 
                        src={image} 
                        alt={`سحب معاملة ${index + 1}`}
                        className="w-full h-full object-cover aspect-[3/4]"
                      />
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
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
    </div>;
};
export default Index;