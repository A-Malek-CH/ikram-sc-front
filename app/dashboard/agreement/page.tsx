"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { agreementAPI } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AgreementSessionPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    motivation_choices: [] as string[],
    other_motivation: "",
    has_confidence_issues: false,
    confidence_issues: [] as string[],
    other_issues: "",
    expectations: [] as string[],
    other_expectations: "",
  });

  useEffect(() => {
    if (!token) return;
    agreementAPI
      .get(token)
      .then((data) => {
        if (data.submitted !== false) {
          setSubmitted(true);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleCheckbox = (field: keyof typeof form, value: string) => {
    setForm((prev) => {
      const current = prev[field] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!token) return;
    try {
      await agreementAPI.submit(token, form);
      const result = await agreementAPI.get(token);
    console.log("Agreement status after submit:", JSON.stringify(result, null, 2));

      setSubmitted(true);
    } catch (err) {
      alert("حدث خطأ أثناء الإرسال");
    }
  };

  if (loading) return <div className="text-center p-4">جارٍ التحميل...</div>;
  if (submitted)
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4 text-[#1D3557]">تم إرسال العقد بنجاح</h1>
        <Button onClick={() => router.push("/dashboard/confidence-test")}>إجراء اختبار الثقة  </Button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#1D3557] text-center">الجلسة الأولى: عقد إرشادي</h1>
      <p className="text-[#457B9D] text-center">
        يرجى تعبئة النموذج التالي لإتمام اتفاقية المشاركة في البرنامج.
      </p>

      {/* Section 1: Motivation */}
      <div>
        <h2 className="font-bold text-[#1D3557] mb-2">ما الذي يدفعك للمشاركة في هذا البرنامج؟</h2>
        {[
          "تعزيز الثقة بالنفس",
          "تحسين الأداء الأكاديمي",
          "مواجهة التحديات الشخصية أو الاجتماعية",
          "التطوير المهني",
        ].map((option) => (
          <label key={option} className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={form.motivation_choices.includes(option)}
              onCheckedChange={() => handleCheckbox("motivation_choices", option)}
            />
            <span>{option}</span>
          </label>
        ))}
        <Input
          placeholder="أسباب أخرى"
          value={form.other_motivation}
          onChange={(e) => setForm((f) => ({ ...f, other_motivation: e.target.value }))}
        />
      </div>

      {/* Section 2: Confidence Issues */}
      <div>
        <h2 className="font-bold text-[#1D3557] mb-2">هل تواجه مشاكل تتعلق بالثقة بالنفس؟</h2>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            checked={form.has_confidence_issues}
            onChange={(e) =>
              setForm((f) => ({ ...f, has_confidence_issues: e.target.checked }))
            }
          />
          <span>نعم</span>
        </label>
        {form.has_confidence_issues && (
          <>
            {[
              "التفاعل الاجتماعي",
              "التحضير للامتحانات والعروض",
              "القرارات الحياتية",
            ].map((option) => (
              <label key={option} className="flex items-center gap-2 mb-1">
                <Checkbox
                  checked={form.confidence_issues.includes(option)}
                  onCheckedChange={() => handleCheckbox("confidence_issues", option)}
                />
                <span>{option}</span>
              </label>
            ))}
            <Input
              placeholder="أمور أخرى"
              value={form.other_issues}
              onChange={(e) => setForm((f) => ({ ...f, other_issues: e.target.value }))}
            />
          </>
        )}
      </div>

      {/* Section 3: Expectations */}
      <div>
        <h2 className="font-bold text-[#1D3557] mb-2">توقعاتك من البرنامج:</h2>
        {[
          "تطوير قدرة التحدث أمام الجمهور",
          "بناء العلاقات الاجتماعية بسهولة",
          "التحسين في تقدير الذات",
          "تحسين القدرة على اتخاذ القرارات",
        ].map((option) => (
          <label key={option} className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={form.expectations.includes(option)}
              onCheckedChange={() => handleCheckbox("expectations", option)}
            />
            <span>{option}</span>
          </label>
        ))}
        <Textarea
          placeholder="أمور أخرى"
          value={form.other_expectations}
          onChange={(e) =>
            setForm((f) => ({ ...f, other_expectations: e.target.value }))
          }
        />
      </div>

      <div className="text-red-600 text-sm text-center font-medium mt-4"> من خلال الموافقة، أنت تقر بأن الرسائل قد تُستخدم لأغراض البحث العلمي. </div> <div className="text-center mt-4"> <Button onClick={handleSubmit} className="bg-[#1D3557] hover:bg-[#0F1C2D]"> إرسال العقد </Button> </div>
    </div>
  );
}