"use client"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from "firebase/firestore"
import { MessageSquareCode, Send, Mic, Sparkles, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
    id: string
    text: string
    role: 'user' | 'assistant'
    timestamp: any
}

/**
 * Reuse Zero-Dep Markdown Renderer
 */
function Markdown({ content }: { content: string }) {
    const lines = content.split('\n')
    return (
        <div className="space-y-2 text-slate-300 font-mono text-sm leading-relaxed">
            {lines.map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-2">{line.replace('# ', '')}</h1>
                if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-white mt-4 mb-2">{line.replace('## ', '')}</h2>
                if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc pl-1">{line.trim().substring(2)}</li>
                if (line.startsWith('```')) return null

                // Simple code block styling for indented or backtick-wrapped lines could go here
                // For now, simple text rendering
                const formattedLine = line.split('`').map((part, index) =>
                    index % 2 === 1 ? <code key={index} className="bg-white/10 text-primary-foreground px-1 py-0.5 rounded text-xs">{part}</code> : part
                )

                return <p key={i} className="min-h-[1em]">{line.trim() === '' ? <br /> : formattedLine}</p>
            })}
        </div>
    )
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        // Subscribe to chat history
        const q = query(
            collection(db, "chat_history"),
            orderBy("timestamp", "asc"),
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: ChatMessage[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                msgs.push({
                    id: doc.id,
                    text: data.text,
                    role: data.role,
                    timestamp: data.timestamp
                })
            })
            setMessages(msgs)
        }, (error) => {
            console.error("Error fetching chat:", error)
        })

        return () => unsubscribe()
    }, [])

    const handleSend = async () => {
        if (!input.trim()) return

        setIsSending(true)
        const textToSend = input
        setInput("") // Optimistic clear

        try {
            // 1. Optimistic UI update (optional, but good for "instant" feel)
            // Actually, let's wait for Firestore to echo back to keep source of truth single
            // But we DO need to write to 'commands'

            await addDoc(collection(db, "commands"), {
                text: textToSend,
                timestamp: serverTimestamp(),
                status: 'pending',
                role: 'user' // Explicitly mark as user command
            })

            // Note: We also likely want to manually push to chat_history immediately 
            // if the backend isn't super fast, but for a "Terminal" feel, 
            // let's assume the backend or a cloud function handles the "echo" to chat_history.
            // If not, we might not see our own message until the backend processes it.
            // For this MVP, let's ALSO write the user message to chat_history so it appears instantly.

            await addDoc(collection(db, "chat_history"), {
                text: textToSend,
                role: 'user',
                timestamp: serverTimestamp()
            })

        } catch (err) {
            console.error("Failed to send:", err)
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.metaKey) {
            handleSend()
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-mono selection:bg-cyan-500/30">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 flex flex-col h-screen relative overflow-hidden bg-slate-950">

                {/* Terminal Header */}
                <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                            Secure Command Line // <span className="text-white">v2.4.0</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-2" />
                        <span className="text-[10px] uppercase text-muted-foreground">System Online</span>
                    </div>
                </header>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-20 py-6 space-y-6 custom-scrollbar scroll-smooth">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                            <MessageSquareCode className="h-16 w-16 mb-4" />
                            <p>Initialize conversation...</p>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={cn(
                                    "flex w-full mb-4",
                                    msg.role === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "max-w-[85%] lg:max-w-[70%] rounded-xl p-4 border relative",
                                    msg.role === 'user'
                                        ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-100 rounded-tr-none"
                                        : "bg-slate-900/80 border-white/10 text-slate-300 rounded-tl-none shadow-xl"
                                )}>
                                    {msg.role === 'assistant' && (
                                        <div className="absolute -top-3 -left-3 h-8 w-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shadow-lg">
                                            <Sparkles className="h-4 w-4 text-purple-400" />
                                        </div>
                                    )}

                                    {msg.role === 'user' ? (
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    ) : (
                                        <div className="pl-2">
                                            <Markdown content={msg.text} />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "absolute bottom-2 right-3 text-[9px] font-bold opacity-40 uppercase",
                                        msg.role === 'user' ? "text-cyan-200" : "text-slate-500"
                                    )}>
                                        {msg.role}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="shrink-0 p-4 lg:p-6 bg-slate-900/80 backdrop-blur border-t border-white/5">
                    <div className="max-w-4xl mx-auto relative group">
                        {/* Glow Border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl opacity-50 group-hover:opacity-100 transition duration-500 blur-sm"></div>

                        <div className="relative flex items-end gap-2 bg-slate-950 rounded-xl border border-white/10 p-2 shadow-2xl">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter command directive... (Cmd+Enter to execute)"
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-slate-600 resize-none min-h-[50px] max-h-[200px] py-3 px-3 font-mono"
                                rows={1}
                                style={{ height: 'auto', minHeight: '52px' }}
                            />

                            <div className="flex flex-col gap-2 pb-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg">
                                    <Mic className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isSending}
                                    className={cn(
                                        "h-8 w-8 rounded-lg transition-all duration-300",
                                        input.trim()
                                            ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                            : "bg-white/5 text-muted-foreground"
                                    )}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground mt-3 font-mono opacity-50">
                        Session ID: {new Date().toLocaleDateString()} // Secure Channel Encrypted
                    </p>
                </div>

            </main>
        </div>
    )
}
