"use client";
import { useAuth } from "@/lib/auth-context";
import { sessionAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { userAPI } from "@/lib/api";


export default function HomePage() {
  const { token } = useAuth();
  const [stageProgress, setStageProgress] = useState(0);
  const [testProgress, setTestProgress] = useState<number | null>(null); // new

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token) return;
      try {
        // Fetch stages progress
        const sessions = await sessionAPI.getSessions(token);
        const completed = sessions.filter((s: any) => s.is_completed).length;
        const total = sessions.length;
        setStageProgress(total > 0 ? Math.round((completed / total) * 100) : 0);

        // Fetch latest confidence test score (mocked for now)
        const scoreResponse = await userAPI.getConfidenceScore(token);
        if (typeof scoreResponse.score === "number") {
  setTestProgress(scoreResponse.score);
} else {
  setTestProgress(null);
}


      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchProgress();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <img src="/logo.png" alt="IKRAM-SC Logo" className="w-40 h-40 mb-6 rounded-full shadow-lg" />
        <h1 className="text-3xl font-bold text-[#1D3557] mb-2">
          🎓 IKRAM-SC | Thiqati by Ikram
        </h1>
        <p className="text-lg text-[#457B9D]">
          منصة تفاعلية لدعم الثقة بالنفس لطلبة الجامعات من خلال 13 مرحلة تفاعلية واختبارات قياس الثقة قبل وبعد.
        </p>
      </div>

      <Card className="p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1D3557]">تقدمك في المراحل</h2>
        <Progress value={stageProgress} className="h-5 bg-[#f1faee]" />
        <div className="mt-2 text-[#1D3557] font-bold">{stageProgress}% مكتمل</div>
      </Card>

      <Card className="p-6 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1D3557]">نتيجتك في اختبار الثقة</h2>
        {testProgress !== null ? (
          <>
            <Progress value={(testProgress/240)*100} className="h-5 bg-[#f1faee]" />
            <div className="mt-2 text-[#1D3557] font-bold">{testProgress}/192 مستوى الثقة</div>
          </>
        ) : (
          <div className="text-[#457B9D]">لم تقم بإجراء اختبار الثقة بعد.</div>
        )}
      </Card>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link href="/dashboard/stages">
          <Button size="lg" className="bg-[#1D3557] hover:bg-[#0F1C2D] transition-all duration-200">
            ابدأ أو أكمل المراحل
          </Button>
        </Link>
        <Link href="/dashboard/confidence-test">
          <Button size="lg" variant="outline" className="text-[#1D3557] border-[#1D3557] hover:bg-[#1D3557]/10">
            إجراء اختبار الثقة
          </Button>
        </Link>
      </div>

      <footer className="mt-16 text-center text-sm text-[#457B9D]">
        <p>© {new Date().getFullYear()} IKRAM-SC | Thiqati by Ikram. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
