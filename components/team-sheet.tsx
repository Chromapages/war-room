"use client"

import { TeamMember } from "@/app/team/data"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Cpu, Code, History, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TeamSheetProps {
    member: TeamMember | null
    onClose: () => void
}

export function TeamSheet({ member, onClose }: TeamSheetProps) {
    if (!member) return null

    const Icon = member.icon

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
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{member.name}</h2>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{member.role}</p>
                            </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={onClose} className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Description */}
                        <section>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Code className="h-3 w-3" /> Directive
                            </h3>
                            <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                                {member.description}
                            </p>
                        </section>

                        {/* Core Stats */}
                        <section className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                                <p className="text-[10px] text-muted-foreground uppercase mb-1">Architecture</p>
                                <p className="text-sm font-bold text-white font-mono">{member.model}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-3 rounded-xl">
                                <p className="text-[10px] text-muted-foreground uppercase mb-1">Department</p>
                                <p className="text-sm font-bold text-white capitalize">{member.department}</p>
                            </div>
                        </section>

                        {/* Capabilities */}
                        <section>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Shield className="h-3 w-3" /> Skill Matrix
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {member.capabilities.map((skill, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-primary/5 border-primary/20 text-primary-foreground/90 py-1.5 px-3 uppercase text-[10px] tracking-wider"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        {/* Recent Activity (Mock) */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <History className="h-3 w-3" /> Recent Output
                                </h3>
                            </div>
                            <div className="bg-slate-950/50 rounded-lg p-4 border border-white/5 space-y-3">
                                <div className="flex gap-3 text-xs">
                                    <span className="text-muted-foreground font-mono">10:42</span>
                                    <span className="text-white/70">Refined prompt optimization for better recall.</span>
                                </div>
                                <div className="flex gap-3 text-xs">
                                    <span className="text-muted-foreground font-mono">09:15</span>
                                    <span className="text-white/70">Completed scheduled task execution.</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-slate-950/50">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                            onClick={() => alert(`Manual override initiated for ${member.name}`)}
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            Initialize Manual Override
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
