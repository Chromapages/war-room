"use client"

import { AgentProfile } from "@/lib/mock-data"
import { Card, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Clock, Activity } from "lucide-react"

interface AgentCardProps {
    agent: AgentProfile
    onClick: () => void
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
    const statusColors = {
        online: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
        idle: "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
        busy: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="cursor-pointer"
        >
            <Card className="bg-card/30 backdrop-blur-md border border-white/5 hover:border-primary/40 hover:bg-card/50 transition-all duration-300 overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                <CardHeader className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                                {agent.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-tight">{agent.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{agent.role}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className={`h-2 w-2 rounded-full ${statusColors[agent.status]} animate-pulse`}></div>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{agent.status}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="h-3 w-3 text-primary" />
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Current Task</span>
                            </div>
                            <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                                {agent.currentTask}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Last Active: {agent.lastActive}</span>
                            </div>
                            <div className="px-2 py-0.5 rounded border border-white/5 bg-white/5">
                                EXEC {agent.id.toUpperCase().slice(0, 3)}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    )
}
