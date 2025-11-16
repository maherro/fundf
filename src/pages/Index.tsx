import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import logo from "@/assets/fundfixers-logo.png";
const Index = () => {
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
      {/* Fixed Header Section */}
      <header className="sticky top-0 left-0 right-0 bg-[#1e2936] py-6 px-4 z-50 border-b border-border/50">
        <div className="container max-w-4xl mx-auto text-center bg-[#06102d]">
          <img src={logo} alt="FundFixers Logo" className="mx-auto h-[5.2rem] w-auto" />
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-32"></div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            منصة استرداد الخسائر المالية العالمية
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-foreground text-lg leading-relaxed mb-16 space-y-6">
          <p className="text-center">
            نحن مرخصون من قبل الهيئة الاستثمارية العالمية لنا صلاحية بكل ما يتعلق
            بالضرائب المحلية و العالمية و القوانين الاستثمارية و تم منح هذه
            الصلاحية من قبل صندوق البنك الدولي كمنصة لاسترداد الخسائر المالية
            للمتداولين وخسائر الأصول المتعددة.
          </p>

          <div className="text-center mt-8 space-y-2">
            <p className="font-semibold">الهيئة الاستثمارية العالمية</p>
            <p>المقر الرئيسي - لندن بريطانيا - وزارة المالية</p>
            <p className="text-muted-foreground">
              King Charles St, London SW1A 2AH, United Kingdom
            </p>
          </div>

          <p className="text-center mt-8 text-xl font-semibold">
            تواصل معنا - قدم شكوى ضد شركة تداول أو فوركس نصابة للمطالبة
            القانونية باسترجاع أموالك
          </p>
        </div>

        {/* Form Section */}
        <Card className="p-8 md:p-12 bg-card shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-card-foreground font-semibold text-right">
                الاسم الكامل
              </label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full text-right" placeholder="أدخل اسمك الكامل" />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-card-foreground font-semibold text-right">
                رقم الجوال
              </label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full text-right" placeholder="أدخل رقم الجوال" />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="block text-card-foreground font-semibold text-right">
                الدولة
              </label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full text-right" placeholder="أدخل اسم الدولة" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-card-foreground font-semibold text-right">
                البريد الإلكتروني
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full text-right" placeholder="أدخل البريد الإلكتروني" />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-card-foreground font-semibold text-right">
                وصف الطلب او الحالة
              </label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full min-h-[150px] text-right" placeholder="اشرح حالتك بالتفصيل" />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl py-6">
              إرسال الطلب
            </Button>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-16">
        <p className="text-center text-muted-foreground text-sm">
          FundFixers © جميع الحقوق محفوظة
        </p>
      </footer>
    </div>;
};
export default Index;