"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, updateDoc, doc, Timestamp, addDoc } from "firebase/firestore"
import {
    ShieldAlert,
    Clock,
    DollarSign,
    ChevronRight,
    Timer,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    Skull
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Blocker {
    id: string
    title: string
    client: string
    status: 'Critical' | 'Overdue' | 'This Week' | 'Done' | 'Snoozed'
    overdueDays: number
    impact: number
    createdAt: any
}

const COLUMNS = [
    { id: 'Critical', label: 'Critical', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Skull },
    { id: 'Overdue', label: 'Overdue', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertCircle },
    { id: 'This Week', label: 'This Week', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Timer },
    { id: 'Done', label: 'Complete', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: CheckCircle2 },
    { id: 'Snoozed', label: 'Snoozed', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: Clock },
]

export default function BlockersPage() {
    const [blockers, setBlockers] = useState<Blocker[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterBy, setFilterBy] = useState<'impact' | 'age' | 'none'>('none')

    useEffect(() => {
        const q = query(collection(db, "blockers"), orderBy("impact", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Blocker[] = []
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Blocker)
            })
            setBlockers(data)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching blockers:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("blockerId", id)
    }

    const handleDrop = async (e: React.DragEvent, status: string) => {
        const id = e.dataTransfer.getData("blockerId")
        if (!id) return

        try {
            await updateDoc(doc(collection(db, "blockers"), id), {
                status: status
            })
        } catch (err) {
            console.error("Error updating status:", err)
        }
    }

    const handleSnooze = async (id: string) => {
        try {
            await updateDoc(doc(collection(db, "blockers"), id), {
                status: 'Snoozed',
                snoozedAt: Timestamp.now()
            })
        } catch (err) {
            console.error("Error snoozing:", err)
        }
    }

    const filteredBlockers = blockers
        .filter(b =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.client.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (filterBy === 'impact') return b.impact - a.impact
            if (filterBy === 'age') return b.overdueDays - a.overdueDays
            return 0
        })

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-red-500/30">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 flex flex-col h-screen overflow-hidden">

                {/* Header */}
                <header className="p-6 lg:px-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/50 backdrop-blur-md z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                            <span className="text-xs font-bold text-red-500/80 uppercase tracking-widest font-mono">Operations Risk</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Overdue Blockers</h1>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks or clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 focus:border-red-500/50 text-xs h-9 rounded-lg"
                            />
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                                "h-9 rounded-lg border-white/10 text-xs gap-2",
                                filterBy !== 'none' && "border-indigo-500/50 text-indigo-400 bg-indigo-500/5"
                            )}
                            onClick={() => setFilterBy(prev => prev === 'impact' ? 'age' : prev === 'age' ? 'none' : 'impact')}
                        >
                            <Filter className="h-3 w-3" />
                            Sort: {filterBy === 'none' ? 'None' : filterBy === 'impact' ? 'Impact' : 'Age'}
                        </Button>
                    </div>
                </header>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto p-6 lg:p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-950/10 via-background to-background">
                    {loading ? (
                        <div className="h-full w-full flex flex-col items-center justify-center opacity-40">
                            <RefreshCw className="h-10 w-10 animate-spin text-red-500 mb-4" />
                            <p className="text-sm font-mono uppercase tracking-widest text-red-400">Scanning for system bottlenecks...</p>
                        </div>
                    ) : blockers.length === 0 ? (
                        <div className="h-full w-full flex flex-col items-center justify-center opacity-60">
                            <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 group hover:scale-110 transition-transform cursor-pointer">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">All Clear 🎉</h2>
                            <p className="text-muted-foreground text-sm max-w-xs text-center">Zero mission-critical blockers identified in the current operating window.</p>
                        </div>
                    ) : (
                        <div className="flex h-full gap-6 min-w-max pb-4">
                            {COLUMNS.map((col) => (
                                <div
                                    key={col.id}
                                    className="w-80 flex flex-col h-full rounded-2xl border border-white/5 bg-slate-900/10 backdrop-blur-sm"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, col.id)}
                                >
                                    {/* Column Header */}
                                    <div className={cn("p-4 border-b border-white/5 flex items-center justify-between rounded-t-2xl", col.bg)}>
                                        <div className="flex items-center gap-2">
                                            <col.icon className={cn("h-4 w-4", col.color)} />
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">{col.label}</h3>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-muted-foreground">
                                            {filteredBlockers.filter(b => b.status === col.id).length}
                                        </Badge>
                                    </div>

                                    {/* Column Content */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        <AnimatePresence mode="popLayout">
                                            {filteredBlockers
                                                .filter(b => b.status === col.id)
                                                .map((blocker) => (
                                                    <motion.div
                                                        key={blocker.id}
                                                        layout
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, blocker.id)}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group cursor-grab active:cursor-grabbing shadow-xl"
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">{blocker.client}</p>
                                                                <h4 className="text-sm font-bold text-white leading-tight group-hover:text-red-400 transition-colors">{blocker.title}</h4>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="h-3 w-3" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4 gap-2">
                                                            <div className="flex gap-2">
                                                                <div className="bg-white/5 px-2 py-1 rounded flex items-center gap-1.5 border border-white/5">
                                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                                    <span className={cn(
                                                                        "text-[10px] font-mono font-bold",
                                                                        blocker.overdueDays > 7 ? "text-red-400" : "text-orange-400"
                                                                    )}>{blocker.overdueDays}d</span>
                                                                </div>
                                                                <div className="bg-white/5 px-2 py-1 rounded flex items-center gap-1.5 border border-white/5">
                                                                    <DollarSign className="h-3 w-3 text-emerald-400" />
                                                                    <span className="text-[10px] font-mono font-bold text-white">${blocker.impact.toLocaleString()}</span>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 text-[10px] uppercase font-bold text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg px-2"
                                                                onClick={() => handleSnooze(blocker.id)}
                                                            >
                                                                Snooze
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
