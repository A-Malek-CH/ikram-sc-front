import Link from "next/link"
import { Button } from "@/components/ui/button"
export const metadata = {
  title: "🎓 IKRAM-SC | Thiqati by Ikram",
  description: "منصة ثقتي الإرشادية لتعزيز الثقة بالنفس لدى طلاب الجامعات",
  icons: {
    icon: "/favicon.png", // You can use .png instead of .ico
  },
}

export default function AboutPage() {
    
  return (
    
    <div className="min-h-screen bg-[#f1faee]">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 sm:px-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#1D3557]">
            🎓 IKRAM-SC | Thiqati by Ikram
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#1D3557] hover:bg-[#1D3557]/10">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#1D3557] hover:bg-[#1D3557]/90">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-16 px-4 sm:px-6">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557] mb-4">
              من نحن
            </h1>
            <p className="text-lg text-[#1D3557] opacity-80">
              🎓 IKRAM-SC | Thiqati by Ikram هي منصة إرشاد نفسي تفاعلي مخصصة لطلاب الجامعات، تهدف إلى تعزيز الثقة بالنفس من خلال رحلة مؤلفة من 13 مرحلة تفاعلية. يبدأ المستخدم باختبار أولي لقياس مستوى ثقته بنفسه، ثم ينتقل بين مراحل منظمة تقدم محادثات وأسئلة تفاعلية تعتمد على علم النفس الإيجابي وتقنيات العلاج المعرفي السلوكي، ويُختتم البرنامج باختبار نهائي لتقييم التقدم.
            </p>
            <p className="text-lg text-[#1D3557] opacity-80">
              تقدم المنصة تجربة موجهة وآمنة باللغة العربية تُمكن الطالب من استكشاف ذاته وتطوير مهاراته الشخصية مثل اتخاذ القرار، وضع الأهداف، إدارة المشاعر، والتعبير عن الذات بثقة.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="logo.png"
              alt="حول المنصة"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1D3557] text-white py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                🎓 IKRAM-SC | Thiqati by Ikram
              </h3>
              <p className="text-[#a8dadc]">
                منصة نفسية تفاعلية لتعزيز الثقة بالنفس لدى طلاب الجامعات.
              </p>
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
              <p className="text-[#a8dadc] mb-2">info@thiqati-platform.com</p>
              <p className="text-[#a8dadc]">الهاتف: +213 555 123 456</p>
            </div>
          </div>
          <div className="border-t border-[#457b9d] mt-8 pt-8 text-center text-[#a8dadc]">
            <p>© {new Date().getFullYear()} Thiqati by Ikram. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
