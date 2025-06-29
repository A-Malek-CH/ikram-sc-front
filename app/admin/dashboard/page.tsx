"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AdminAnswersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (user?.role === "admin") {
      setIsAuthorized(true);
    } else {
      router.push("/dashboard");
    }
  }, [user, token, router]);

  const handleExport = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/export_answers/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) throw new Error("فشل في تحميل البيانات");

      const data = await res.json();

      const confidenceScores = data.confidence_scores || [];
      const stageAnswers = data.session_answers || [];

      const workbook = XLSX.utils.book_new();

      // Sheet: نتائج الثقة بالنفس
      const scoreSheetData = [["الاسم", "النتيجة", "التاريخ"]];
      confidenceScores.forEach((item) => {
        scoreSheetData.push([item.user, item.score, item.timestamp]);
      });
      const scoreSheet = XLSX.utils.aoa_to_sheet(scoreSheetData);
      XLSX.utils.book_append_sheet(workbook, scoreSheet, "نتائج الثقة");

      // Sheet: إجابات الجلسات
      const answerSheetData = [["الاسم", "المرحلة", "السؤال", "الإجابة", "التاريخ"]];
      stageAnswers.forEach((item) => {
        answerSheetData.push([item.user, item.stage, item.question, item.answer, item.timestamp]);
      });
      const answerSheet = XLSX.utils.aoa_to_sheet(answerSheetData);
      XLSX.utils.book_append_sheet(workbook, answerSheet, "إجابات الجلسات");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "بيانات_الطلاب.xlsx");
    } catch (error) {
      alert("حدث خطأ أثناء التصدير");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return <div className="text-center p-6 text-gray-600">جاري التحقق من الصلاحيات...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-[#1D3557]">تصدير بيانات المستخدمين</h1>
      <Card className="p-6">
        <p className="text-gray-600 mb-4">
          يمكنك تحميل جميع إجابات اختبار الثقة وإجابات الجلسات الخاصة بجميع المستخدمين في ملف Excel.
        </p>
        <Button onClick={handleExport} disabled={loading} className="bg-[#1D3557] hover:bg-[#0F1C2D]">
          {loading ? "جارٍ التحميل..." : "تحميل ملف Excel"}
        </Button>
      </Card>
    </div>
  );
}
