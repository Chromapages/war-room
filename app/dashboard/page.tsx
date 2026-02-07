"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import {
    doc,
    onSnapshot,
    collection,
    query,
    orderBy,
    limit
} from "firebase/firestore"
import { AgentFeed } from "@/components/agent-feed"
import { BlockerBoard } from "@/components/blocker-board"
import { InfraGrid } from "@/components/infra-grid"
import { ClientCard } from "@/components/client-card"
import { MOCK_LOGS, MOCK_BLOCKERS, MOCK_INFRA, FirestoreStats, FirestoreLog } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import {
    Bell,
    Loader2,
    RefreshCw,
    ClipboardCheck,
    Mail,
    FileText,
    Rocket,
    UserPlus,
    Play
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const QUICK_ACTIONS = [
    {
        id: "sync",
        label: "Sync Clients",
        description: "Fetch latest CRM records",
        icon: RefreshCw,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
    },
    {
        id: "standup",
        label: "Run Standup",
        description: "Generate daily AI briefing",
        icon: ClipboardCheck,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20"
    },
    {
        id: "email",
        label: "Draft Email",
        description: "Auto-generate outreach",
        icon: Mail,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20"
    },
    {
        id: "quote",
        label: "New Quote",
        description: "Project cost estimator",
        icon: FileText,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
    },
    {
        id: "deploy",
        label: "Deploy Site",
        description: "Push changes to production",
        icon: Rocket,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20"
    },
    {
        id: "add",
        label: "Add Client",
        description: "Import or manual entry",
        icon: UserPlus,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20"
    },
]

const FinancialPulse = ({ stats }: { stats: FirestoreStats }) => (
    <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/60 border border-emerald-500/20 rounded-2xl p-6 lg:p-8 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-500 shadow-2xl backdrop-blur-md">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Revenue Cycle</p>
                </div>
                <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">MTD</Badge>
            </div>

            <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic">
                        ${stats.revenue_mtd.toLocaleString()}
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-sm text-[10px] font-black flex items-center border border-emerald-500/20">
                            ▲ 8.4%
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Velocity</span>
                    </div>
                </div>

                {/* Tactical Sparkline */}
                <div className="h-12 w-24 shrink-0">
                    <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            d="M0,35 L10,32 L25,38 L45,20 L60,25 L80,10 L100,5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-emerald-500"
                            strokeLinecap="round"
                        />
                        <circle cx="100" cy="5" r="3" className="fill-emerald-500 shadow-lg" />
                    </svg>
                </div>
            </div>

            <div className="space-y-4 mt-8">
                <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <span>Phase Goal: $15k</span>
                    <span>{Math.round((stats.revenue_mtd / 15000) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((stats.revenue_mtd / 15000) * 100, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    />
                </div>
            </div>
        </div>
    </div>
)

export default function DashboardPage() {
    const [stats, setStats] = useState<FirestoreStats | null>(null)
    const [logs, setLogs] = useState<FirestoreLog[]>([])
    const [loading, setLoading] = useState(true)
    const [activeAction, setActiveAction] = useState<string | null>(null)

    useEffect(() => {
        if (!db) {
            console.error("Firestore 'db' is not initialized. Check your firebase.ts config.")
            setLoading(false)
            return
        }

        // 1. Subscribe to Stats
        // Use explicit collection/doc syntax for better compatibility
        const statsDocRef = doc(collection(db, "stats"), "current")
        const unsubStats = onSnapshot(statsDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setStats(docSnap.data() as FirestoreStats)
            }
            setLoading(false)
        }, (error) => {
            console.error("Error fetching stats:", error)
            setLoading(false)
        })

        // 2. Subscribe to Logs
        const logsColRef = collection(db, "logs")
        const logsQuery = query(logsColRef, orderBy("time_string", "desc"), limit(10))
        const unsubLogs = onSnapshot(logsQuery, (querySnap) => {
            const logsData: FirestoreLog[] = []
            querySnap.forEach((doc) => {
                logsData.push(doc.data() as FirestoreLog)
            })
            setLogs(logsData)
        }, (error) => {
            console.error("Error fetching logs:", error)
        })

        return () => {
            unsubStats()
            unsubLogs()
        }
    }, [])

    const handleAction = (id: string) => {
        setActiveAction(id)
        setTimeout(() => setActiveAction(null), 2000)
        console.log(`Action triggered: ${id}`)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-mono gap-4">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                <p className="text-sm tracking-widest uppercase opacity-50">Synchronizing Command Center...</p>
            </div>
        )
    }

    const displayStats = stats || {
        vps_health: 'healthy',
        active_agents: 4,
        api_quota: 45,
        revenue_mtd: 12450
    }

    const displayLogs = logs.length > 0 ? logs : []

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 lg:ml-64">
                <main className="p-4 sm:p-6 lg:p-10 overflow-x-hidden relative max-w-7xl mx-auto pb-32">
                    {/* Background Gradients */}
                    <div className="fixed inset-0 pointer-events-none z-[-1]">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[150px] rounded-full"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                    </div>

                    {/* Header */}
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Command Center</h1>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono text-[10px]">Neural Operations Dashboard v4.2</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/80">Systems Nominal</span>
                            </div>
                            <Button size="icon" variant="ghost" className="rounded-full relative h-12 w-12 hover:bg-white/5 md:h-10 md:w-10">
                                <Bell className="h-6 w-6 text-muted-foreground" />
                                <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-red-500 border border-slate-950"></span>
                            </Button>
                        </div>
                    </header>

                    {/* MOBILE PRIORITY: Financial Pulse */}
                    <section className="md:hidden mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                Critical Pulse
                                <div className="h-px w-8 bg-white/10"></div>
                            </h2>
                        </div>
                        <FinancialPulse stats={displayStats} />
                    </section>

                    {/* Quick Stats Grid */}
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                Metrics Snapshot
                                <div className="h-px w-8 bg-white/10"></div>
                            </h2>
                        </div>
                        <InfraGrid data={displayStats} />
                    </section>

                    {/* Quick Actions */}
                    <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                Priority Ops
                                <div className="h-px w-8 bg-white/10"></div>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {QUICK_ACTIONS.map((action, i) => (
                                <motion.button
                                    key={action.id}
                                    whileHover={{ scale: 1.02, translateY: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAction(action.id)}
                                    className={cn(
                                        "flex items-center gap-4 p-5 rounded-2xl border bg-slate-900/40 backdrop-blur-sm text-left group transition-all duration-300 min-h-[80px]",
                                        action.border,
                                        activeAction === action.id ? "ring-2 ring-white/20" : "hover:bg-slate-900/60"
                                    )}
                                >
                                    <div className={cn(
                                        "h-14 w-14 lg:h-12 lg:w-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg shrink-0",
                                        action.bg,
                                        action.border,
                                        action.color
                                    )}>
                                        <action.icon className={cn("h-7 w-7 lg:h-6 lg:w-6", activeAction === action.id && "animate-spin")} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{action.label}</h3>
                                        <p className="text-[11px] text-muted-foreground font-mono leading-tight mt-0.5">{action.description}</p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </section>

                    {/* Executive Client Hub (Recently Active) */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.4em] flex items-center gap-3">
                                Executive Hub
                                <div className="h-px w-12 bg-cyan-500/20"></div>
                            </h2>
                            <Badge variant="outline" className="text-[9px] font-mono border-white/10 text-white/40 uppercase">Active Now</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <ClientCard
                                client="NORTH STAR CORP"
                                title="Infrastructure Renewal"
                                value={45000}
                                status="nominal"
                                lastSync="14:02"
                                tags={["Enterprise", "Q3 Target"]}
                            />
                            <ClientCard
                                client="CYBERCORE LTD"
                                title="AI Integration Audit"
                                value={12800}
                                status="attention"
                                lastSync="09:15"
                                tags={["Retainer", "Urgent"]}
                            />
                            <ClientCard
                                client="APEX VENTURES"
                                title="Seed Round Deployment"
                                value={85000}
                                status="critical"
                                lastSync="Yesterday"
                                tags={["High Value", "Review"]}
                            />
                        </div>
                    </section>

                    {/* Layout Switcher (Mobile Stack vs Desktop Grid) */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-12">

                        <div className="xl:col-span-2 space-y-10">
                            {/* Approvals (Priority 2) */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                        Approvals Pipeline
                                        <div className="h-px w-8 bg-white/10"></div>
                                    </h2>
                                    <Badge variant="outline" className="text-[9px] font-mono border-amber-500/20 text-amber-500 bg-amber-500/5 uppercase">{MOCK_BLOCKERS.length} Priority</Badge>
                                </div>
                                <BlockerBoard items={MOCK_BLOCKERS} />
                            </section>

                            {/* Operational Log */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                        Operational Log
                                        <div className="h-px w-8 bg-white/10"></div>
                                    </h2>
                                </div>
                                <div className="h-[400px] md:h-[500px] relative rounded-2xl border border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
                                    <AgentFeed logs={displayLogs} />
                                </div>
                            </section>
                        </div>

                        {/* Desktop Priority Table (Hidden on mobile as it's at the top) */}
                        <div className="hidden xl:block space-y-10">
                            <section className="h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                        Financial Pulse
                                        <div className="h-px w-8 bg-white/10"></div>
                                    </h2>
                                </div>
                                <FinancialPulse stats={displayStats} />
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
