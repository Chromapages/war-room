"use client"

import { TeamMember } from "@/app/team/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Power, Zap, Moon, Activity } from "lucide-react"

interface TeamCardProps {
    member: TeamMember
    onClick: () => void
}

export function TeamCard({ member, onClick }: TeamCardProps) {
    const Icon = member.icon

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            case 'idle': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
            case 'sleeping': return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
            default: return 'text-slate-400'
        }
    }

    const getModelColor = (model: string) => {
        if (model.includes('Kimi')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        if (model.includes('Antigravity')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg"
            onClick={onClick}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white leading-tight group-hover:text-primary transition-colors">{member.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium">{member.role}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className={cn("uppercase text-[10px] tracking-wider h-5", getStatusColor(member.status))}>
                        {member.status === 'active' && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
                        {member.status === 'sleeping' && <Moon className="h-3 w-3 mr-1" />}
                        {member.status}
                    </Badge>
                </div>

                {/* Model Badge */}
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("font-mono text-[10px]", getModelColor(member.model))}>
                        {member.model}
                    </Badge>
                </div>

                {/* Footer / Action */}
                <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-4">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-50">Authorized</span>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            // Simulate wake up logic
                            alert(`Signal sent to ${member.name}. Waking up agent...`)
                        }}
                    >
                        <Zap className="h-3 w-3 mr-1.5" />
                        Trigger
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
