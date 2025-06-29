"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "@/lib/auth-context";
import { sessionAPI } from "@/lib/api";


const questions = [
  "أحب الاختلاط بالناس",
  "أشعر بالضيق كثيرا من نفسي  ",
  "يؤلمني أنني لست جميل المظهر",
  "تعتبر إجراء مقابلة مع شخص من الجنس الأخر أمرا مهما بالنسبة لي  ",
  "أنا أكثر سعادة قياسا بباقي زملائي",
  "أنا راض عن مظهري الجسمي",
  "أشعر بالخجل كثيرا عند التحدث أمام مجموعة من الناس",
  "أرغب في معرفة الناس إلا أنني أكره مقابلتهم حرصا على عدم ضياع وقتي",
  "يمثل الأداء الأكاديمي مجالا أستطيع من خلاله أن أظهر كفاءتي",
  "أبدو أفضل في مظهري مقارنة باي شخص عادي",
  "يفزعني أن أفكر في التحدث أمام جمع من الناس",
  "أشعر بالتردد حتى في المواقف التي سبق وأن نجحت فيها من قبل",
  "تقل ثقتي في قدرتي العقلية على تحقيق أهدافي الأكاديمية وانجازها بنجاح ",
  "أشعر أنني لست في كفاءة الاجتماعية لغالبية الناس في التعامل مع الغير",
  "أعبر عن نفسي بفعالية ووضوح   عندما أكون مجبرا على التحدث أمام مجموعة من الناس",
  "أنا محظوظ كوني وسيما بالشكل الذي أنا عليه",
  "أفتقر إلى بعض القدرات الهامة اللازمة لتحقيق النجاح والتفوق في الدراسة",
  "اعترف أنني كطالب لست ممتازا مثل العديد من الزملاء الذين أتنافس معهم",
  "تعد مقابلة أناس جدد –بالنسبة لي- خبرة ممتعة أتطلع دوما إليها",
  "انتقد نفسي أكثر مما كنت عليه سابقا",
  "اشعر دائما بالراحة والسعادة في أي مناسبة اجتماعية",
  "شكوكي حول قدراتي الأكاديمية تقل عن شكوك معظم زملائي حول قدراتهم",
  "تصادفني مشاكل أكثر من غيري في التعامل مع زميل من الجنس الأخر",
  "تزداد عدم ثقتي في قدرتي على التحدث بوضوح أمام جمع من الناس",
  "يقلقني أنني لست في نفس المستوي الفكري للآخرين",
  "حينما تسوء الأمور أكون عادة واثقا من أنني سأتعامل معها بنجاح",
  "أنا أكثر من الآخرين قلقا وانشغالا بقدرتي على إقامة علاقات اجتماعية مع الغير",
  "تزداد ثقتي في نفسي عن كثيرين أعرفهم",
  "اشعر بالخوف وعدم الثقة عندما أفكر في مقابلة مع الجنس الأخر",
  "يرى الكثيرون أن مظهري الجسمي غير جذاب",
  " عندما أدرس مقررا جديد أكون متأكد من أنني سوف اجتازه بتفوق بحيث سأكون ضمن أفضل الطلاب فيه",
  "لا أقل عن غالبية الناس في قدرتي على التحدث أمام مجموعة",
  "حينما اذهب إلى أي تجمعات اجتماعية كالحفلات مثلا فإنني كثيرا ما أشعر بالارتباك والتعب  ",
  "أتجنب أحيانا القيام ببعض الأشياء لأنها تتطلب تواجدي في وسط مجموعة",
  "حينما يتم تحديد تاريخ الاختبارات الدراسية أكون على يقين من أنني سوف أؤديها بنجاح",
  "عند مقابلة أناس جدد أتحدث إليهم بشكل أفضل من كثيرين غيري",
  "اشعر الآن بأنني أكثر حزما وحسما للأمور",
  "أقوم أحيانا بتجنب أي زميل من الجنس الآخر لأنني أظل متوترا",
  "أتمنى لو أستطيع أن أغير من مظهري الجسمي",
  "قلقي وانشغالي حول التحدث أمام حشد من الناس أقل من كثيرين غيري",
  " اشعر الأن بأنني أكثر تفاؤلا وإيجابية مقارنة بأي وقت اخر ",
  "لا يعد التعامل مع زميل لي من الجنس الآخر مشكلة بالنسبة لي",
  "لو أنني كنت أكثر ثقة بنفسي أثناء تعاملي مع غيري لكانت حياتي أفضل مما هي عليه الآن",
  "ابحث دوما عن أنشطة أكاديمية متنوعة تتطلب التحدي العقلي لأنني أكون على ثقة في قدرتي على النجاح فيها أفضل من غيري",
  "بإمكاني الحصول على عدد كبير من المعجبين دون أي صعوبة",
  "حينما أكون في وسط جماعة يقل شعوري بالراحة كثيرا قياسا بما يشعر به باقي الأعضاء",
  "تزداد ثقتي بنفسي عند التعامل مع زملاء من الجنس الآخر",
  "لو أن مظهري الجسمي كان أفضل مما هو عليه، لكنت أكثر جاذبية للجنس الأخر",
];

const options = [
  "تنطبق تماما",
  "تنطبق بدرجة كبيرة",
  "تنطبق إلى حد ما",
  "لا تنطبق كثيرا",
  "لا تنطبق إطلاقا",
];

const negativeQuestions = [2, 3, 7, 8, 11, 12, 13, 14, 17, 18, 20, 23, 24, 25, 27, 29, 30, 33, 34, 38, 39, 43, 46, 48];

const scoreMap = {
  "تنطبق تماما": 4,
  "تنطبق بدرجة كبيرة": 3,
  "تنطبق إلى حد ما": 2,
  "لا تنطبق كثيرا": 1,
  "لا تنطبق إطلاقا": 0,
};

const reverseScoreMap = {
  "تنطبق تماما": 0,
  "تنطبق بدرجة كبيرة": 1,
  "تنطبق إلى حد ما": 2,
  "لا تنطبق كثيرا": 3,
  "لا تنطبق إطلاقا": 4,
};

export const calculateScore = (responses: string[]) => {
let total = 0;
responses.forEach((answer, index) => {
const questionNumber = index + 1;
const isNegative = negativeQuestions.includes(questionNumber);
const map = isNegative ? reverseScoreMap : scoreMap;
const score = map[answer as keyof typeof map]; // ✅ type assertion
total += score;
});
return total;
};
export default function ConfidenceTestPage() {
  const { token } = useAuth();

    const exportToExcel = () => {
  const worksheetData = [["السؤال", "الإجابة"]];
  responses.forEach((answer, index) => {
    worksheetData.push([`السؤال ${index + 1}`, answer]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "إجابات اختبار الثقة");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "نتيجة_اختبار_الثقة.xlsx");
};

  const [responses, setResponses] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);


  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

const handleSubmit = async () => {
  if (responses.includes("")) {
    alert("يرجى الإجابة على جميع الأسئلة قبل الإرسال.");
    return;
  }

  const score = calculateScore(responses);

  try {
    await sessionAPI.submitConfidenceScore(token!, score); // Assumes token is from useAuth()
    setFinalScore(score); // ✅ Save score to state
    console.log("النتيجة المحسوبة:", score);
    setSubmitted(true);
  } catch (error) {
    console.error("فشل في إرسال النتيجة:", error);
    alert("حدث خطأ أثناء إرسال النتيجة. حاول مرة أخرى.");
  }
};

  if (submitted) {
return (
<div className="max-w-3xl mx-auto p-4 text-center">
<h1 className="text-3xl font-bold text-[#1D3557] mb-4">شكرًا لك!</h1>
<p className="text-lg text-[#457B9D] mb-2">تم تسجيل إجاباتك بنجاح.</p>
 {finalScore !== null && (
    <div className="mt-4 text-xl text-[#1D3557] font-semibold">
      <p>النتيجة: {finalScore} من 192</p>
      <p className="mt-2">
        {
          finalScore < 96
            ? "مستوى منخفض من الثقة بالنفس"
            : finalScore < 144
            ? "مستوى متوسط من الثقة بالنفس"
            : "مستوى مرتفع من الثقة بالنفس"
        }
      </p>
    </div>
  )}

  <Button
    onClick={exportToExcel}
    className="mt-6 bg-[#1D3557] hover:bg-[#0F1C2D]"
  >
    تحميل الإجابات كملف Excel
  </Button>
</div>
);
}

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <img src="/logo.png" alt="IKRAM-SC Logo" className="w-32 h-32 mb-4 rounded-full shadow-lg" />
        <h1 className="text-2xl font-bold text-[#1D3557] mb-2">
          اختبار قياس الثقة بالنفس
        </h1>
        <p className="text-lg text-[#457B9D]">
          يرجى الإجابة على الأسئلة التالية بناءً على شعورك الحالي.
        </p>
      </div>

      <form className="space-y-6">
        {questions.map((q, idx) => (
          <Card key={idx} className="p-4 shadow-md">
            <div className="mb-4">
              <span className="font-bold text-[#1D3557]">{idx + 1}. {q}</span>
            </div>
            <div className="flex justify-between text-[#1D3557] font-medium flex-wrap gap-2">
              {options.map((option, optionIdx) => (
                <label key={optionIdx} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={option}
                    checked={responses[idx] === option}
                    onChange={() => handleChange(idx, option)}
                    className="w-5 h-5 ml-2 accent-[#1D3557]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </Card>
        ))}

        <div className="flex justify-center mt-8">
          <Button type="button" onClick={handleSubmit} className="bg-[#1D3557] hover:bg-[#0F1C2D]">
            إرسال الإجابات
          </Button>
        </div>
      </form>

      <footer className="mt-16 text-center text-sm text-[#457B9D]">
        <p>© {new Date().getFullYear()} IKRAM-SC | Thiqati by Ikram. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
