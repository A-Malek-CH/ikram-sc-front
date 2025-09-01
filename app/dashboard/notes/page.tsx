"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { notesAPI } from "@/lib/api"

export default function NotesPage() {
  const [note, setNote] = useState("")
  const [savedNotes, setSavedNotes] = useState<{ id: number; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ✅ Fetch notes on page load
  useEffect(() => {
    const fetchNotes = async () => {
      if (!token) return
      try {
        const data = await notesAPI.getNotes(token)
        setSavedNotes(data)
      } catch (error) {
        console.error("Error fetching notes:", error)
      }
    }
    fetchNotes()
  }, [token])

  // ✅ Save note to backend
  const handleSave = async () => {
    if (!note.trim() || !token) return
    setLoading(true)
    try {
      const newNote = await notesAPI.addNote(token, { content: note.trim() })
      setSavedNotes([...savedNotes, newNote])
      setNote("")
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Delete note
  const handleDelete = async (id: number) => {
    if (!token) return
    try {
      await notesAPI.deleteNote(token, id)
      setSavedNotes(savedNotes.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-extrabold mb-6 text-[#1D3557]">📝 ملاحظاتي</h1>

      {/* Example Section (your exact pairs) */}
      <Card className="mb-6 shadow-md border-none bg-[#A8DADC] bg-opacity-20">
        <CardContent className="p-4">
          <h2 className="font-bold text-[#1D3557] mb-3">مثال على ورقة العمل</h2>

          <div className="overflow-hidden rounded-lg border border-[#A8DADC]">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#1D3557] text-white font-bold">
              <div className="p-3 text-center">الأفكار السلبية</div>
              <div className="p-3 text-center">الأفكار البديلة الإيجابية</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#A8DADC] bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-3 text-[#1D3557] text-center">"أنا لست جيدًا في الرياضيات."</div>
                <div className="p-3 text-[#1D3557] text-center">"يمكنني التحسن بالتدريب والممارسة."</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-3 text-[#1D3557] text-center">"لا أحد يهتم بي."</div>
                <div className="p-3 text-[#1D3557] text-center">"لدي أصدقاء يحبونني، وربما مشغولون الآن."</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-3 text-[#1D3557] text-center">"لن أتمكن من النجاح."</div>
                <div className="p-3 text-[#1D3557] text-center">"بالمثابرة والجهد، سأحقق النجاح."</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-3 text-[#1D3557] text-center">"أنا سيء في التحدث أمام الناس."</div>
                <div className="p-3 text-[#1D3557] text-center">"يمكنني التحسن مع التدريب والممارسة."</div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-[#457B9D] text-center">
            جرّب كتابة فكرتك السلبية في العمود الأيسر وابحث عن بديل إيجابي واقعي في العمود الأيمن.
          </p>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="shadow-md border-none bg-white">
        <CardContent className="p-4">
          <Textarea
            placeholder="✍️ اكتب ملاحظاتك هنا..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSave} disabled={loading} className="bg-[#1D3557] hover:bg-[#457B9D] text-white">
            {loading ? "جاري الحفظ..." : "حفظ الملاحظة"}
          </Button>

          {savedNotes.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-[#1D3557] mb-2">📚 ملاحظاتك:</h3>
              <ul className="space-y-2">
                {savedNotes.map((n) => (
                  <li
                    key={n.id}
                    className="flex justify-between items-center p-3 bg-[#F1FAEE] rounded-md shadow-sm"
                  >
                    <span className="whitespace-pre-wrap">{n.content}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(n.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="حذف الملاحظة"
                      title="حذف الملاحظة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
