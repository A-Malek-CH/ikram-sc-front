import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f1faee]">
      <header className="container mx-auto py-6 px-4 sm:px-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#1D3557]">منصة علم النفس</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#1D3557] hover:bg-[#1D3557]/10">تسجيل الدخول</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#1D3557] hover:bg-[#1D3557]/90">إنشاء حساب</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto py-16 px-4 sm:px-6">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557]">
                رحلة نفسية تفاعلية لفهم ذاتك بشكل أفضل
              </h1>
              <p className="text-lg text-[#1D3557] opacity-80">
                منصتنا تقدم رحلة من 13 مرحلة مصممة بعناية لمساعدتك على استكشاف جوانب شخصيتك وتطوير مهاراتك النفسية
                بطريقة تفاعلية وممتعة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-[#1D3557] hover:bg-[#1D3557]/90">
                    ابدأ الرحلة الآن
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-[#1D3557] border-[#1D3557] hover:bg-[#1D3557]/10">
                    تعرف علينا أكثر
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="رحلة نفسية"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto py-20 px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-[#1D3557] mb-12">كيف تعمل المنصة؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-[#1D3557]/30">
              <div className="w-12 h-12 bg-[#a8dadc] rounded-full flex items-center justify-center mb-4">
                <span className="text-[#1D3557] font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1D3557]">سجل في المنصة</h3>
              <p className="text-[#1D3557] opacity-80">أنشئ حسابك الشخصي للبدء في رحلتك النفسية التفاعلية.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-[#1D3557]/30">
              <div className="w-12 h-12 bg-[#a8dadc] rounded-full flex items-center justify-center mb-4">
                <span className="text-[#1D3557] font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1D3557]">أكمل المراحل</h3>
              <p className="text-[#1D3557] opacity-80">تفاعل مع كل مرحلة من خلال محادثات تفاعلية مصممة لمساعدتك على فهم ذاتك.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border border-[#1D3557]/30">
              <div className="w-12 h-12 bg-[#a8dadc] rounded-full flex items-center justify-center mb-4">
                <span className="text-[#1D3557] font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#1D3557]">تابع تقدمك</h3>
              <p className="text-[#1D3557] opacity-80">راجع محادثاتك السابقة وتابع تقدمك عبر المراحل المختلفة.</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#a8dadc] px-4 sm:px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1D3557] mb-12">ماذا يقول المستخدمون عنا</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-[#1D3557]/30">
                <p className="text-[#1D3557] opacity-80 mb-4">
                  "هذه المنصة غيرت نظرتي لذاتي بشكل كامل. المراحل المختلفة ساعدتني على فهم جوانب من شخصيتي لم أكن أدركها
                  من قبل."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#1D3557]/20 rounded-full mr-3"></div>
                  <div>
                    <p className="font-bold text-[#1D3557]">سارة أحمد</p>
                    <p className="text-sm text-[#1D3557] opacity-70">طالبة جامعية</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md border border-[#1D3557]/30">
                <p className="text-[#1D3557] opacity-80 mb-4">
                  "أسلوب المحادثة التفاعلي جعل العملية ممتعة وسهلة. أنصح بشدة كل من يرغب في تطوير ذاته نفسياً بتجربة هذه
                  المنصة."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#1D3557]/20 rounded-full mr-3"></div>
                  <div>
                    <p className="font-bold text-[#1D3557]">محمد خالد</p>
                    <p className="text-sm text-[#1D3557] opacity-70">مهندس برمجيات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1D3557] text-white py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">منصة علم النفس</h3>
              <p className="text-[#a8dadc]">منصة تفاعلية لمساعدتك على فهم ذاتك وتطوير مهاراتك النفسية.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-[#a8dadc] hover:text-white">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-[#a8dadc] hover:text-white">
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-[#a8dadc] hover:text-white">
                    سياسة الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-[#a8dadc] hover:text-white">
                    شروط الاستخدام
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
              <p className="text-[#a8dadc] mb-2">البريد الإلكتروني: info@psychology-platform.com</p>
              <p className="text-[#a8dadc]">الهاتف: +123 456 7890</p>
            </div>
          </div>
          <div className="border-t border-[#457b9d] mt-8 pt-8 text-center text-[#a8dadc]">
            <p>© {new Date().getFullYear()} منصة علم النفس. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}