"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Send,
  Bot,
  User,
  Search,
  Trash2,
  Plus,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  chatService,
  Conversation,
  ConversationDetail,
  Message,
} from "@/services/chatService";
import { cn } from "@/lib/utils";

interface App {
  id: number;
  name: string;
  package_name: string;
  icon_url: string | null;
}

export default function ChatbotPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(
    null
  );
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    loadApps();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadApps = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch (error) {
      console.error("Failed to load apps:", error);
    }
  };

  const selectConversation = async (conv: Conversation) => {
    setLoading(true);
    try {
      const detail = await chatService.getConversation(conv.id);
      setSelectedConv(detail);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async (app: App) => {
    setLoading(true);
    try {
      const conv = await chatService.createConversation(app.id);
      await loadConversations();
      const detail = await chatService.getConversation(conv.id);
      setSelectedConv(detail);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (convId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Supprimer cette conversation ?")) return;

    try {
      await chatService.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (selectedConv?.id === convId) {
        setSelectedConv(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedConv || sending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };

    setSelectedConv((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, userMessage],
          }
        : null
    );

    setInput("");
    setSending(true);

    try {
      const botResponse = await chatService.sendMessage(selectedConv.id, input);
      setSelectedConv((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, botResponse],
            }
          : null
      );
      loadConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.app_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-xl overflow-hidden border border-border/50 bg-card shadow-xl">
      {/* Left Panel - Conversations List */}
      <div className="w-80 border-r border-border/40 flex flex-col bg-card/50">
        {/* Header */}
        <div className="p-4 border-b border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chats</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedConv(null)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Nouveau
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={cn(
                "w-full flex items-center gap-3 p-3 border-b border-border/20 hover:bg-accent/50 transition-colors group",
                selectedConv?.id === conv.id && "bg-accent"
              )}
            >
              {conv.app_icon ? (
                <img
                  src={conv.app_icon}
                  alt=""
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="size-6 text-primary" />
                </div>
              )}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate">
                    {conv.app_name || "Application"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(conv.updated_at)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.last_message || "Pas de messages"}
                </p>
              </div>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded text-destructive transition-opacity"
              >
                <Trash2 className="size-4" />
              </button>
            </button>
          ))}
          {filteredConversations.length === 0 && (
            <div className="text-center py-12 px-4">
              <MessageSquare className="size-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                Aucune conversation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat or Apps Grid */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border/40 flex items-center gap-3 bg-card/30">
              {selectedConv.app_icon ? (
                <img
                  src={selectedConv.app_icon}
                  alt=""
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="size-5 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {selectedConv.app_name || "Application"}
                </p>
                <p className="text-xs text-muted-foreground">Assistant IA</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[70%] text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none whitespace-pre-wrap"
                    )}
                  >
                    {msg.content}
                    <div
                      className={cn(
                        "text-[10px] mt-1 opacity-70",
                        msg.role === "user" ? "text-right" : "text-left"
                      )}
                    >
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="size-4 text-muted-foreground animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <span className="size-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="size-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/40 bg-card/30">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Input
                  placeholder="Posez votre question sur les avis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || sending}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          // No conversation selected -> Show App Grid
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="size-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="size-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Nouvelle Conversation
                </h2>
                <p className="text-muted-foreground">
                  Sélectionnez une application pour commencer à analyser ses
                  avis avec l'IA.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => startConversation(app)}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 group bg-card"
                  >
                    {app.icon_url ? (
                      <img
                        src={app.icon_url}
                        alt=""
                        className="size-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {(app.name || app.package_name)
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="text-center w-full">
                      <p className="font-medium truncate w-full">
                        {app.name || app.package_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate w-full opacity-70">
                        {app.package_name}
                      </p>
                    </div>
                  </button>
                ))}
                {apps.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Aucune application trouvée. Commencez par ajouter une app
                    dans le dashboard.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
