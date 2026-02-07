"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import { Brain, RefreshCw, Loader2, List, Clock, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Simple Zero-Dependency Markdown Renderer
 * Used as a fallback because of environment permission issues with react-markdown
 */
function MarkdownFallback({ content }: { content: string }) {
    const lines = content.split('\n')

    return (
        <div className="space-y-4 text-slate-400 leading-relaxed">
            {lines.map((line, i) => {
                // H1
                if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-4xl font-bold text-white border-b border-white/5 pb-4 mb-8 mt-4">{line.replace('# ', '')}</h1>
                }
                // H2
                if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold text-white mt-12 mb-4">{line.replace('## ', '')}</h2>
                }
                // H3
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-2">{line.replace('### ', '')}</h3>
                }
                // List Item
                if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                    return <li key={i} className="ml-4 list-disc pl-2">{line.trim().substring(2)}</li>
                }
                // Code Block (Simple start/end toggle logic would be better, but this is a quick fix)
                if (line.startsWith('```')) {
                    return null // Skipping triple backticks for this simple parser
                }
                // Bold
                const formattedLine = line.split('**').map((part, index) =>
                    index % 2 === 1 ? <strong key={index} className="text-white font-bold">{part}</strong> : part
                )
                // Inline Code
                const finalLine = Array.isArray(formattedLine)
                    ? formattedLine.map(p => typeof p === 'string' ? p.split('`').map((cPart, cIndex) =>
                        cIndex % 2 === 1 ? <code key={cIndex} className="bg-primary/10 text-primary-foreground px-1.5 py-0.5 rounded font-mono text-sm">{cPart}</code> : cPart
                    ) : p)
                    : formattedLine

                return <p key={i} className="min-h-[1em]">{line.trim() === '' ? <br /> : finalLine}</p>
            })}
        </div>
    )
}

export default function MemoryPage() {
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState<string>("")
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)

    // Table of Contents state
    const [toc, setToc] = useState<{ id: string, text: string, level: number }[]>([])

    useEffect(() => {
        // Subscribe to knowledge/memory_core
        const docRef = doc(db, "knowledge", "memory_core")
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                const rawContent = data.content || ""
                setContent(rawContent)
                setLastUpdated(data.updatedAt || data.lastUpdated || "Recently")

                // Simple regex to extract headers for TOC
                const headers = rawContent.match(/^#+\s+.+$/gm) || []
                const tocItems = headers.map((h: string) => {
                    const level = (h.match(/#/g) || []).length
                    const text = h.replace(/^#+\s+/, "")
                    const id = text.toLowerCase().replace(/[^\w]+/g, "-")
                    return { id, text, level }
                })
                setToc(tocItems)
            } else {
                setContent("# Memory Core Empty\n\nThe central knowledge base is currently offline or unpopulated. Initialize the War Room Core to populate this sector.")
            }
            setLoading(false)
        }, (error) => {
            console.error("Error fetching memory core:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 p-4 lg:p-8 overflow-x-hidden relative flex flex-col h-screen">
                {/* Ambient Background */}
                <div className="fixed inset-0 pointer-events-none z-[-1]">
                    <div className="absolute top-0 left-[20%] w-[60%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                </div>

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary/80 uppercase tracking-widest font-mono">Knowledge Base</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Memory Core</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Last Synced: {lastUpdated}</span>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full gap-2 border-white/10 hover:bg-white/5">
                            <RefreshCw className="h-3 w-3" />
                            <span className="text-xs">Re-Index</span>
                        </Button>
                    </div>
                </header>

                {/* Dependency Alert (Only show if needed, but we'll show it as a subtle debug status) */}
                <div className="mb-4 flex items-center gap-2 text-[10px] text-amber-500/60 uppercase font-mono tracking-widest">
                    <AlertTriangle className="h-2 w-2" />
                    Running in Neural Fallback Mode (No-Dep Core)
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="h-10 w-10 mb-4 animate-spin text-primary" />
                        <p className="text-sm font-mono uppercase tracking-widest">Accessing Neural Repository...</p>
                    </div>
                ) : (
                    <div className="flex-1 flex gap-8 overflow-hidden">
                        {/* Sticky TOC */}
                        <aside className="hidden xl:block w-64 shrink-0 overflow-y-auto custom-scrollbar pb-10">
                            <div className="sticky top-0 space-y-4">
                                <div className="flex items-center gap-2 text-white/50 mb-6">
                                    <List className="h-4 w-4" />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] font-mono">Archives</span>
                                </div>
                                <nav className="space-y-1">
                                    {toc.length > 0 ? toc.map((item, i) => (
                                        <a
                                            key={i}
                                            href={`#${item.id}`}
                                            className={cn(
                                                "block text-xs py-1.5 transition-colors hover:text-white border-l border-white/5 pl-4 -ml-px",
                                                item.level === 1 ? "font-bold text-white/90" : "text-muted-foreground",
                                                item.level === 2 ? "pl-8" : "",
                                                item.level === 3 ? "pl-12 text-[10px]" : ""
                                            )}
                                        >
                                            {item.text}
                                        </a>
                                    )) : (
                                        <p className="text-[10px] italic text-muted-foreground">No headers detected in current archive.</p>
                                    )}
                                </nav>

                                <div className="pt-8">
                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                        <Shield className="h-4 w-4 text-primary mb-2" />
                                        <p className="text-[10px] font-bold text-white uppercase mb-1">Read Only</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">Memory artifacts are curated by the Decider and Strategy team.</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Content View */}
                        <article className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/10 border border-white/5 rounded-2xl p-6 lg:p-12 shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                            <div className="max-w-none">
                                <MarkdownFallback content={content} />
                            </div>
                        </article>
                    </div>
                )}
            </main>
        </div>
    )
}
