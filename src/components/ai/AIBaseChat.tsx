"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handle = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handle}
            className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-muted"
        >
            {copied ? (
                <Check size={13} className="text-green-500" />
            ) : (
                <Copy size={13} className="text-muted-foreground" />
            )}
        </button>
    );
}

function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.role === "user";

    return (
        <div className={cn("flex gap-3 group", isUser && "flex-row-reverse")}>
            <div
                className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mt-1 shrink-0",
                    isUser ? "bg-primary text-primary-foreground" : "bg-muted border"
                )}
            >
                {isUser ? <User size={14} /> : <Bot size={14} />}
            </div>

            <div className={cn("max-w-[75%]", isUser && "flex flex-col items-end")}>
                <div
                    className={cn(
                        "px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                    )}
                >
                    {msg.content}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    {!isUser && <CopyButton text={msg.content} />}
                </div>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-muted border flex items-center justify-center">
                <Bot size={14} />
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AIBaseChat({
    endpoint,
    title,
    subtitle,
    suggestions,
}: {
    endpoint: string;
    title: string;
    subtitle: string;
    suggestions: string[];
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, loading]);

    const send = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: trimmed }),
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: data?.data || "No response",
                    timestamp: new Date(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: "Something went wrong",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
            textareaRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">

            <div className="border-b px-4 py-3 flex justify-between items-center">
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>

                {messages.length > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => setMessages([])}>
                        <Trash2 size={14} />
                    </Button>
                )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <Sparkles />
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {subtitle}
                        </p>

                        <div className="grid gap-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => send(s)}
                                    className="border px-3 py-2 rounded hover:bg-muted text-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((m) => (
                            <MessageBubble key={m.id} msg={m} />
                        ))}
                        {loading && <TypingIndicator />}
                    </>
                )}
            </div>

            <div className="border-t p-3 flex gap-2">
                <Textarea
                    ref={textareaRef}
                    value={input}
                    placeholder="Ask anything about real estate..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send(input);
                        }
                    }}
                    className="min-h-10.5 max-h-32 resize-none"
                />
                <Button
                    onClick={() => send(input)}
                    disabled={!input.trim() || loading}
                >
                    <Send size={16} />
                </Button>
            </div>
        </div>
    );
}