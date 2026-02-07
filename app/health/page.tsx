"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { HEALTH_DATA, APIHealth } from "@/app/health/data"
import {
    Activity,
    RefreshCw,
    Clock,
    Database,
    CreditCard,
    Layout,
    Facebook,
    Flame,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Timer
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SERVICE_ICONS: Record<string, any> = {
    ghl: Layout,
    stripe: CreditCard,
    notion: Database,
    meta: Facebook,
    firebase: Flame
}

export default function HealthPage() {
    const [services, setServices] = useState<APIHealth[]>(HEALTH_DATA)
    const [isRetrying, setIsRetrying] = useState<string | null>(null)

    const handleRetry = (id: string) => {
        setIsRetrying(id)
        setTimeout(() => {
            setIsRetrying(null)
            // Log successful retry simulation
            console.log(`Retry initiated for ${id}`)
        }, 2000)
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-emerald-500/30">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 p-6 lg:p-8 flex flex-col h-screen overflow-hidden">

                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest font-mono">Infrastructure Monitoring</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Systems Health</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Global Systems Nominal</span>
                        </div>
                    </div>
                </header>

                {/* Status Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {services.map((service) => {
                            const Icon = SERVICE_ICONS[service.id] || Activity
                            const isOnline = service.status === 'online'
                            const isError = service.status === 'error'
                            const isWarning = service.status === 'warning'

                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "group relative p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-white/10",
                                        isError ? "border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]" : "border-white/5"
                                    )}
                                >
                                    {/* Ambient Glow */}
                                    <div className={cn(
                                        "absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm z-0",
                                        isOnline ? "bg-emerald-500/5" : isError ? "bg-red-500/5" : "bg-amber-500/5"
                                    )} />

                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Top Row */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
                                                    isOnline ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                                        isError ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                            "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                                )}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-white leading-none mb-1">{service.name}</h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn(
                                                            "h-1.5 w-1.5 rounded-full",
                                                            isOnline ? "bg-emerald-500 animate-pulse" :
                                                                isError ? "bg-red-500" : "bg-amber-500"
                                                        )} />
                                                        <span className={cn(
                                                            "text-[10px] uppercase font-bold tracking-widest",
                                                            isOnline ? "text-emerald-500" :
                                                                isError ? "text-red-500" : "text-amber-500"
                                                        )}>
                                                            {service.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white"
                                                disabled={isRetrying === service.id}
                                                onClick={() => handleRetry(service.id)}
                                            >
                                                <RefreshCw className={cn("h-4 w-4", isRetrying === service.id && "animate-spin text-emerald-500")} />
                                            </Button>
                                        </div>

                                        {/* Metrics / Content */}
                                        <div className="space-y-4 mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                    <p className="text-[10px] text-muted-foreground uppercase mb-1 font-mono">Last Sync</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3 w-3 text-white/40" />
                                                        <span className="text-xs font-bold text-white/90">{service.lastSync}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-right">
                                                    <p className="text-[10px] text-muted-foreground uppercase mb-1 font-mono">{service.metricLabel || "Metric"}</p>
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        isError ? "text-red-400" : "text-emerald-400"
                                                    )}>
                                                        {service.metricValue || "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Meta Specific Countdown */}
                                            {service.countdown && (
                                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Timer className="h-3.5 w-3.5 text-amber-500" />
                                                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Cooling Down</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-amber-500/60">{Math.floor(service.countdown / 24)}d left</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(1 - service.countdown / 168) * 100}%` }}
                                                            className="h-full bg-amber-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error Message */}
                                            {service.message && !service.countdown && (
                                                <div className={cn(
                                                    "p-3 rounded-lg flex gap-3 items-start border",
                                                    isError ? "bg-red-500/5 border-red-500/10 text-red-400/80" : "bg-white/5 border-white/10 text-muted-foreground"
                                                )}>
                                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] leading-relaxed font-mono italic">{service.message}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Link / Quick Status */}
                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span className="text-[9px] uppercase tracking-tighter">Endpoint Verified</span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] h-5 px-1.5 border-white/5 bg-white/5 text-muted-foreground">
                                                {service.id.toUpperCase()}-v3.0
                                            </Badge>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}
