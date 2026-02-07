"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { AgentCard } from "@/components/agent-card"
import { AgentSheet } from "@/components/agent-sheet"
import { MOCK_AGENTS, AgentProfile } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus, Users, Search } from "lucide-react"

export default function AgentsPage() {
    const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null)

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-16 lg:ml-64 p-4 lg:p-8 overflow-x-hidden relative">
                {/* Background Gradients */}
                <div className="fixed inset-0 pointer-events-none z-[-1]">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full"></div>
                </div>

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary/80 uppercase tracking-widest font-mono">Operations Personnel</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">AI Executive Team</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage and monitor your autonomous workforce.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-initial">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
                            />
                        </div>
                        <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Deploy Agent</span>
                        </Button>
                    </div>
                </header>

                {/* Agents Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    {MOCK_AGENTS.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            onClick={() => setSelectedAgent(agent)}
                        />
                    ))}

                    {/* Empty/Add Slot */}
                    <div className="group cursor-pointer">
                        <div className="h-full min-h-[220px] bg-slate-900/20 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 hover:border-primary/20 hover:bg-slate-900/40 transition-all group-active:scale-[0.98]">
                            <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">Deploy New AI Asset</p>
                            <p className="text-xs text-muted-foreground/50 mt-1 uppercase tracking-tighter">Slot 06/12 Available</p>
                        </div>
                    </div>
                </section>

                {/* Detail Sheet */}
                <AgentSheet
                    agent={selectedAgent}
                    onClose={() => setSelectedAgent(null)}
                />
            </main>
        </div>
    )
}
