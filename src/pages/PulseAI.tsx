import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Heart, 
  Stethoscope,
  Pill,
  Activity,
  ThermometerSun,
  Loader2,
  User,
  Bot,
  RefreshCw
} from "lucide-react";
import Navbar from "@/components/Navbar";

const QUICK_SYMPTOMS = [
  { label: "Headache", icon: Brain },
  { label: "Fever", icon: ThermometerSun },
  { label: "Chest Pain", icon: Heart },
  { label: "Fatigue", icon: Activity },
  { label: "Cough", icon: Stethoscope },
  { label: "Nausea", icon: Pill },
];

function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("");
}

export default function PulseAI() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/pulse-ai/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleQuickSymptom = (symptom: string) => {
    const prompt = `I'm experiencing ${symptom.toLowerCase()}. Can you help me understand what might be causing this and what I should do?`;
    sendMessage({ text: prompt });
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-4 shadow-lg shadow-teal-500/25">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Pulse AI</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Your intelligent health assistant. Describe your symptoms and get instant insights about possible conditions and recommended actions.
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <strong>Important:</strong> Pulse AI provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Quick Symptoms</CardTitle>
                <CardDescription className="text-xs">Click to get instant analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {QUICK_SYMPTOMS.map((symptom) => (
                  <Button
                    key={symptom.label}
                    variant="outline"
                    className="w-full justify-start gap-2 text-slate-600 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50"
                    onClick={() => handleQuickSymptom(symptom.label)}
                    disabled={isLoading}
                  >
                    <symptom.icon className="w-4 h-4" />
                    {symptom.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>• Describe symptoms in detail</p>
                <p>• Mention duration and severity</p>
                <p>• Include any medications you take</p>
                <p>• Note any allergies</p>
              </CardContent>
            </Card>

            {messages.length > 0 && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleNewChat}
              >
                <RefreshCw className="w-4 h-4" />
                New Conversation
              </Button>
            )}
          </div>

          {/* Main Chat Area */}
          <Card className="lg:col-span-3 flex flex-col h-[600px]">
            <CardHeader className="border-b bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Chat with Pulse AI</CardTitle>
                  <CardDescription className="text-teal-100 text-sm">
                    {isLoading ? "Analyzing..." : "Ready to help"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                    <Stethoscope className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md">
                    Describe your symptoms in detail, and I&apos;ll analyze them to provide possible conditions and recommendations.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                      Symptom Analysis
                    </Badge>
                    <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                      Health Tips
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Prevention Advice
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const text = getMessageText(message);
                    const isUser = message.role === "user";
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            isUser
                              ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <div className={`text-sm whitespace-pre-wrap ${!isUser ? "prose prose-sm max-w-none prose-headings:text-slate-800 prose-strong:text-slate-800" : ""}`}>
                            {text}
                          </div>
                        </div>
                        {isUser && (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-slate-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-slate-100 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Analyzing your symptoms...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms in detail..."
                  className="min-h-[60px] max-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
