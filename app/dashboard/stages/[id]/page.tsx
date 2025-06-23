"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, MessageCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { sessionAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
// 👇 Add this at the top of your `page.tsx` file
type SpeechRecognition = any
type SpeechRecognitionErrorEvent = {
  error: string
}
type SpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

type Message = {
  id: number
  message: string
  is_user: boolean
  creation_date: string
  session: number
}

type Session = {
  id: number
  stage: {
    id: number
    order: number
    name: string
    description: string
    is_chat: boolean
  }
  current_question: number
  is_unlocked: boolean
  is_completed: boolean
  creation_date: string
  user: number
}

export default function StagePage() {
  const hasInitialized = useRef(false); // prevents multiple init calls

  const params = useParams()
  const router = useRouter()
  const { token, user } = useAuth()
  const { toast } = useToast()

  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)


  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = Number(params.id)
  const speakText = (text: string) => {
  if (!window.speechSynthesis) return

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "ar-SA" // Arabic language
  utterance.rate = 1        // Adjust speaking speed
  utterance.pitch = 1       // Adjust pitch

  window.speechSynthesis.speak(utterance)
}

  const startListening = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert("متصفحك لا يدعم التعرف على الصوت")
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = "ar-SA"
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => setIsListening(true)

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript
    console.log("Transcript:", transcript)
    setNewMessage(transcript) // <- automatically fill the input
  }

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error:", event.error)
  }

  recognitionRef.current = recognition
  recognition.start()
}

const stopListening = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop()
    setIsListening(false)
  }
}



  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!token) return

      try {
        // Get all sessions first to find the current one
        const sessionsData = await sessionAPI.getSessions(token)
        const currentSession = sessionsData.find((s: Session) => s.id === sessionId)

        if (!currentSession) {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على المرحلة المطلوبة",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setSession(currentSession)
      } catch (error) {
        console.error("Failed to fetch session data:", error)
        toast({
          title: "خطأ في تحميل البيانات",
          description: "فشل في تحميل بيانات المرحلة",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessionData()
  }, [token, sessionId, router, toast])

  // Fetch chat messages
  useEffect(() => {
  const fetchChatMessages = async () => {
    if (!token || !session || !session.is_unlocked || hasInitialized.current) return;

    try {
      // Step 1: Get existing chat messages
      const existingMessages = await sessionAPI.getChatMessages(token, sessionId);
      setMessages(existingMessages);

      // Step 2: Initialize the chat (only if session not completed)
      if (!session.is_completed) {
        const initializedMessages = await sessionAPI.initializeChat(token, sessionId);

        if (Array.isArray(initializedMessages)) {
          // Filter out any duplicate messages
          const messageIds = new Set(existingMessages.map((m: Message) => m.id));
          const newMessages = initializedMessages.filter((m: Message) => !messageIds.has(m.id));

          if (newMessages.length > 0) {
            setMessages([...existingMessages, ...newMessages]);
          }
        } else {
          console.error("Expected initializedMessages to be an array, but got:", initializedMessages);
        }
      }

      hasInitialized.current = true; // ✅ Mark initialization as done
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    }
  };

  fetchChatMessages();
}, [token, session, sessionId]);


  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!token || !session || !newMessage.trim()) return

    setIsSending(true)
    const newMessageData: Message = {
      id: Date.now(), // Temporary ID, will be replaced by the server
      message: newMessage,
      is_user: true,
      creation_date: new Date().toISOString(),
      session: session.id,
    }
    setMessages((prevMessages) => [...prevMessages, newMessageData])
    setNewMessage("")
    scrollToBottom()

    try {
      // Send message to API
      const response = await sessionAPI.sendChatMessage(token, session.id, newMessage)

      // Update messages with the response (which includes both user message and bot response)
      
      setMessages(prevMessages => {
  const updated = [...prevMessages, ...response]

  const botMessages = response.filter((msg: Message) => !msg.is_user)
  for (const botMessage of botMessages) {
    speakText(botMessage.message) // 🔊 Speak each bot message
  }

  return updated
})


      setNewMessage("")
      scrollToBottom()
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "فشل في إرسال الرسالة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#457B9D] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg text-[#1D3557]">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-[#1D3557] text-lg">لم يتم العثور على المرحلة المطلوبة</p>
        <Link href="/dashboard" className="text-[#457B9D] hover:text-[#1D3557] mt-4 inline-block">
          العودة إلى لوحة التحكم
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center text-[#457B9D] hover:text-[#1D3557] transition-colors">
          <ArrowLeft className="h-4 w-4 ml-1" />
          <span>العودة إلى لوحة التحكم</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-3 h-3 rounded-full ${session.is_completed ? "bg-green-500" : "bg-[#457B9D]"}`}
          ></span>
          <span className="text-[#1D3557] font-medium">{session.is_completed ? "مكتملة" : "قيد التقدم"}</span>
        </div>
      </div>
        <div className="mb-4 flex justify-end">
  <Button
    variant="outline"
    className="text-red-600 border-red-500 hover:bg-red-50"
    onClick={async () => {
      if (!confirm("هل أنت متأكد أنك تريد إعادة تعيين هذه المرحلة؟")) return;

      try {
        await sessionAPI.resetSession(token!, sessionId); // 👈 call your reset API
        setMessages([]);
        setSession((prev) =>
          prev ? { ...prev, current_question: 0, is_completed: false } : null
        );
        hasInitialized.current = false; // 👈 allow initializeChat to run again
        toast({ title: "تمت إعادة التعيين", description: "تمت إعادة تعيين المرحلة بنجاح." });
      } catch (error) {
        console.error("Reset failed", error);
        toast({ title: "خطأ", description: "فشل في إعادة التعيين", variant: "destructive" });
      }
    }}
  >
    إعادة تعيين المرحلة
  </Button>
</div>


      <Card className="mb-6 border-none shadow-md bg-white overflow-hidden">
        <div className="bg-[#1D3557] text-white p-4">
          <h1 className="text-xl font-bold">{session.stage.name}</h1>
        </div>
        <CardContent className="p-4 bg-[#A8DADC] bg-opacity-20">
          <p className="text-[#1D3557]">{session.stage.description}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="bg-[#457B9D] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <MessageCircle className="h-5 w-5" />
            <h2 className="font-bold">المحادثة</h2>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <Clock className="h-4 w-4" />
            <span>{new Date(session.creation_date).toLocaleDateString("ar-EG")}</span>
          </div>
        </div>

        <CardContent className="p-0">
          <ScrollArea className="h-[450px] p-4 bg-white">
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.is_user ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.is_user ? "flex-row-reverse" : ""}`}>
                      <Avatar className={message.is_user ? "bg-[#1D3557] text-white" : "bg-[#A8DADC] text-[#1D3557]"}>
                        <AvatarFallback>{message.is_user ? user?.first_name?.charAt(0) || "م" : "م"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.is_user ? "bg-[#1D3557] text-white" : "bg-[#A8DADC] text-[#1D3557]"
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-[#457B9D]">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-center">
                    {session.is_unlocked ? "ابدأ المحادثة بإرسال رسالة" : "هذه المرحلة غير متاحة حالياً"}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-[#A8DADC] bg-opacity-20 border-t border-[#A8DADC]">
            <div className="flex gap-2">
  <Input
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="اكتب رسالتك هنا..."
    onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
    disabled={!session.is_unlocked || isSending}
    className="border-[#457B9D] focus-visible:ring-[#1D3557]"
  />

  {/* 🎤 Mic button */}
  <Button
  type="button"
  size="icon"
  variant="outline"
  onMouseDown={startListening}
  onMouseUp={stopListening}
  onMouseLeave={stopListening} // ← ensures stop if they move mouse off
  onTouchStart={startListening}
  onTouchEnd={stopListening}
  className={`border-[#1D3557] ${
    isListening
      ? "bg-[#1D3557] text-white"
      : "text-[#1D3557] hover:bg-[#1D3557] hover:text-white"
  }`}
>
  🎤
</Button>


  {/* 📤 Send button */}
  <Button
    onClick={handleSendMessage}
    size="icon"
    disabled={!session.is_unlocked || !newMessage.trim() || isSending}
    className="bg-[#1D3557] hover:bg-[#457B9D] text-white"
  >
    <Send className="h-4 w-4" />
  </Button>
</div>

            {!session.is_unlocked && (
              <p className="text-[#457B9D] text-sm mt-2">
                هذه المرحلة غير متاحة حالياً. يرجى إكمال المراحل السابقة أولاً.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
