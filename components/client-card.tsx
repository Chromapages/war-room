"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ChevronRight,
    DollarSign,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ClientCardProps {
    client: string
    title: string
    value: number
    status: 'nominal' | 'attention' | 'critical'
    avatar?: string
    lastSync: string
    tags?: string[]
}

export function ClientCard({ client, title, value, status, lastSync, tags }: ClientCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const statusColors = {
        nominal: "bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]",
        attention: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
        critical: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
    }

    const statusIcons = {
        nominal: CheckCircle2,
        attention: AlertCircle,
        critical: HelpCircle
    }

    const Icon = statusIcons[status]

    return (
        <motion.div
            layout
            className="group relative"
        >
            <Card
                className={cn(
                    "bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[24px] overflow-hidden transition-all duration-300",
                    isExpanded ? "ring-2 ring-cyan-500/20" : "hover:border-white/10"
                )}
            >
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-left p-6 flex items-start gap-4 min-h-[44px]"
                >
                    {/* Avatar / Placeholder */}
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0 relative">
                        <span className="text-lg font-black text-cyan-400 italic">{client.charAt(0)}</span>
                        <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950", statusColors[status])} />
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">{client}</h4>
                            <div className="bg-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-white/40 uppercase">
                                {lastSync}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{title}</h3>

                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1.5 bg-cyan-500/5 px-2.5 py-1 rounded-full border border-cyan-500/10">
                                <DollarSign className="h-3 w-3 text-cyan-400" />
                                <span className="text-xs font-black text-white">${value.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/20">
                                <Activity className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        className="text-white/10 group-hover:text-cyan-500 transition-colors pt-1"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 overflow-hidden border-t border-white/5 bg-white/[0.02]"
                        >
                            <div className="grid grid-cols-2 gap-4 pt-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Risk Level</p>
                                    <div className="flex items-center gap-2">
                                        <Icon className={cn("h-4 w-4", status === 'nominal' ? 'text-cyan-400' : 'text-amber-400')} />
                                        <span className="text-xs font-bold text-white uppercase italic">Level 2 Alpha</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Last Activity</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-white/20" />
                                        <span className="text-xs font-bold text-white uppercase italic">3 Hours Ago</span>
                                    </div>
                                </div>
                            </div>

                            {tags && tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {tags.map((tag: string) => (
                                        <Badge key={tag} variant="outline" className="text-[9px] font-mono border-white/10 bg-white/5 text-white/60 uppercase">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="mt-8 flex gap-3">
                                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase text-[10px] h-11 rounded-xl shadow-[0_4px_15px_rgba(8,145,178,0.3)]">
                                    Deep Audit
                                </Button>
                                <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-white font-black uppercase text-[10px] h-11 rounded-xl">
                                    Executive Brief
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    )
}
