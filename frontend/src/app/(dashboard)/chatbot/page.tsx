"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useState } from "react";

const mockMessages = [
  {
    id: 1,
    role: "bot",
    content:
      "Hello! I'm your Feedly AI assistant. How can I help you analyze your reviews today?",
  },
  {
    id: 2,
    role: "user",
    content: "Show me the top issues from the last week.",
  },
  {
    id: 3,
    role: "bot",
    content:
      "Based on the analysis of 1,248 reviews from the last week, the top issues are:\n1. Login crash on Android 14 (Critical)\n2. Dark mode toggle not saving preference\n3. Slow loading times on 'My Profile' screen",
  },
];

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), role: "user", content: input };
    setMessages([...messages, newMsg]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          content: "I'm processing your request... (This is a demo)",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <Button variant="outline" className="gap-2">
          <Sparkles className="size-4" />
          Generate Monthly Report
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-primary/10 shadow-lg">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="size-4 text-primary" />
            Feedly AI
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="size-5" />
                ) : (
                  <Bot className="size-5" />
                )}
              </div>
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="p-4 border-t bg-background">
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              placeholder="Ask about your reviews, trends, or bugs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
