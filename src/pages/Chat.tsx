import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Copy, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import { chatWithAssistant } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hello, I'm MediSense AI Assistant. How can I help you with your clinical analysis today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAssistant([...messages, userMessage]);
      setMessages(prev => [...prev, { role: "model", content: response || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "model", content: "Error: Failed to connect to AI service. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clinical Assistant</h1>
        <p className="text-slate-500">Ask questions, analyze symptoms, or research medical literature.</p>
      </header>

      <Card className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  msg.role === "model" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800"
                )}>
                  {msg.role === "model" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === "model" 
                    ? "bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200" 
                    : "bg-primary text-white"
                )}>
                  <div className="markdown-body prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.role === "model" && i === messages.length - 1 && !isLoading && (
                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1">
                        <Copy className="w-3 h-3" /> Copy
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] gap-1">
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-slate-500">MediSense is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptoms, patient history, or ask a medical question..."
              className="flex-1 bg-white dark:bg-slate-950 h-12"
            />
            <Button type="submit" size="icon" className="h-12 w-12" disabled={isLoading}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            AI-generated content can be incorrect. Always verify clinical information.
          </p>
        </div>
      </Card>
    </div>
  );
}
