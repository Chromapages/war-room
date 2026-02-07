"use client"

import { AgentProfile, MOCK_LOGS } from "@/lib/mock-data"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Cpu, Code, History, Terminal as TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AgentSheetProps {
    agent: AgentProfile | null
    onClose: () => void
}

export function AgentSheet({ agent, onClose }: AgentSheetProps) {
    if (!agent) return null

    // Filter logs for this specific agent (or just show recent ones if we don't have per-agent logs yet)
    const agentLogs = MOCK_LOGS.filter(log => log.agent.toLowerCase() === agent.name.toLowerCase()).slice(0, 10)

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex justify-end">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />

                {/* Panel */}
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md bg-card/95 backdrop-blur-2xl border-l border-white/5 h-screen shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">{agent.avatar}</div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{agent.role}</p>
                            </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={onClose} className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Status Section */}
                        <section>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Cpu className="h-3 w-3" /> Core Parameters
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Status</p>
                                    <p className="text-sm font-bold text-white capitalize">{agent.status}</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Latency</p>
                                    <p className="text-sm font-bold text-white font-mono">24ms</p>
                                </div>
                            </div>
                        </section>

                        {/* Skills */}
                        <section>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Shield className="h-3 w-3" /> Capability Matrix
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {agent.skills.map((skill, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-primary/5 border-primary/20 text-primary-foreground/90 py-1 px-3"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        {/* Logs History */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <History className="h-3 w-3" /> Execution History
                                </h3>
                                <Badge variant="outline" className="text-[10px] font-mono opacity-50">LIVE</Badge>
                            </div>
                            <div className="space-y-4">
                                {agentLogs.length > 0 ? agentLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors mt-2"></div>
                                            <div className="flex-1 w-px bg-white/5 my-1"></div>
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-mono text-muted-foreground">{log.timestamp}</span>
                                                <Badge variant="outline" className="h-4 text-[9px] uppercase px-1 text-primary/60 border border-primary/10">SUCCESS</Badge>
                                            </div>
                                            <p className="text-xs text-white/70 leading-relaxed">{log.message || "Operation completed successfully"}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white/5 p-8 rounded-xl border border-white/5 text-center">
                                        <TerminalIcon className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-xs text-muted-foreground italic">No recent execution logs found for this entity.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-slate-950/50">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            Initialize Manual Directive
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
