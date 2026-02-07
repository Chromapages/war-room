"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import {
    GitMerge,
    Search,
    RefreshCw,
    ChevronRight,
    MoreVertical,
    DollarSign,
    Clock,
    ExternalLink,
    Target,
    ArrowRight,
    X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const PIPELINE_STAGES = [
    { id: 'lead', label: 'Lead', color: 'bg-slate-500/10', text: 'text-slate-400' },
    { id: 'proposal', label: 'Proposal Sent', color: 'bg-blue-500/10', text: 'text-blue-400' },
    { id: 'negotiation', label: 'In Negotiation', color: 'bg-indigo-500/10', text: 'text-indigo-400' },
    { id: 'won', label: 'Won', color: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { id: 'inprogress', label: 'In Progress', color: 'bg-amber-500/10', text: 'text-amber-400' },
    { id: 'delivered', label: 'Delivered', color: 'bg-purple-500/10', text: 'text-purple-400' },
    { id: 'paid', label: 'Paid', color: 'bg-emerald-500/20', text: 'text-emerald-500' }
]

interface PipelineProject {
    id: string
    client: string
    projectTitle: string
    value: number
    stage: string
    lastActivity: string
    owner: string
    probability?: number
}

export default function PipelinePage() {
    const [projects, setProjects] = useState<PipelineProject[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProject, setSelectedProject] = useState<PipelineProject | null>(null)

    useEffect(() => {
        const q = query(collection(db, "pipeline"), orderBy("value", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: PipelineProject[] = []
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as PipelineProject)
            })
            setProjects(data)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching pipeline:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const filteredProjects = projects.filter(p =>
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStageIndex = (stageId: string) => PIPELINE_STAGES.findIndex(s => s.id === stageId)
    const getProgress = (stageId: string) => ((getStageIndex(stageId) + 1) / PIPELINE_STAGES.length) * 100

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30 overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 flex flex-col h-screen relative">

                {/* Header */}
                <header className="p-6 lg:px-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/50 backdrop-blur-md z-10 shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <GitMerge className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-500/80 uppercase tracking-widest font-mono">Sales Intelligence</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Project Pipeline</h1>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10 focus:border-indigo-500/50 text-xs h-9 rounded-lg"
                            />
                        </div>
                        <Button size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px] items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                            <RefreshCw className="h-3 w-3" />
                            Sync Notion
                        </Button>
                    </div>
                </header>

                {/* Pipeline Track */}
                <div className="flex-1 overflow-x-auto p-6 lg:p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-950/10 via-background to-background">
                    {loading ? (
                        <div className="h-full w-full flex flex-col items-center justify-center opacity-40">
                            <RefreshCw className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-sm font-mono uppercase tracking-widest text-indigo-400">Loading Pipeline Data...</p>
                        </div>
                    ) : (
                        <div className="flex h-full min-w-max gap-0">
                            {PIPELINE_STAGES.map((stage, i) => (
                                <div
                                    key={stage.id}
                                    className={cn(
                                        "w-72 flex flex-col h-full border-r border-white/5 relative group transition-colors",
                                        stage.color,
                                        i === 0 && "border-l border-white/5 rounded-l-2xl",
                                        i === PIPELINE_STAGES.length - 1 && "rounded-r-2xl"
                                    )}
                                >
                                    {/* Stage Header */}
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-1.5 w-1.5 rounded-full", stage.id === 'won' || stage.id === 'paid' ? 'bg-emerald-500' : 'bg-indigo-500')} />
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">{stage.label}</h3>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-muted-foreground">
                                            {filteredProjects.filter(p => p.stage === stage.id).length}
                                        </Badge>
                                    </div>

                                    {/* Stage Content */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                                        <AnimatePresence mode="popLayout">
                                            {filteredProjects
                                                .filter(p => p.stage === stage.id)
                                                .map((project) => (
                                                    <motion.button
                                                        key={project.id}
                                                        layout
                                                        onClick={() => setSelectedProject(project)}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="w-full text-left bg-slate-900/60 border border-white/5 rounded-xl p-4 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl"
                                                    >
                                                        {/* Small Progress Line */}
                                                        <div className="absolute top-0 left-0 h-[2px] bg-slate-800 w-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${getProgress(project.stage)}%` }}
                                                                className="h-full bg-indigo-500"
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <p className="text-[10px] text-indigo-400 uppercase font-black tracking-tighter mb-0.5">{project.client}</p>
                                                                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{project.projectTitle}</h4>
                                                            </div>
                                                            <div className="text-white/20 select-none group-hover:text-indigo-500/40 transition-colors">
                                                                <ChevronRight className="h-4 w-4" />
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1">
                                                                    <DollarSign className="h-2.5 w-2.5 text-emerald-400" />
                                                                    <span className="text-[10px] font-mono font-bold text-white">${project.value.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-[9px] font-mono text-muted-foreground uppercase">{project.lastActivity}</p>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Visual Connector */}
                                    {i < PIPELINE_STAGES.length - 1 && (
                                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden lg:flex">
                                            <ArrowRight className="h-8 w-8 text-white/5 group-hover:text-white/10 transition-colors" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Side Panel (Replacing missing Sheet component) */}
                <AnimatePresence>
                    {selectedProject && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProject(null)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.aside
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-950 border-l border-white/10 z-50 p-6 flex flex-col text-white shadow-2xl"
                            >
                                <div className="flex justify-end mb-6">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)} className="h-8 w-8 hover:bg-white/5 text-muted-foreground">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                                    <header className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold text-indigo-400 border-indigo-500/20 bg-indigo-500/5 uppercase tracking-widest">{selectedProject.stage}</Badge>
                                            <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase">{selectedProject.owner}</span>
                                        </div>
                                        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">{selectedProject.client}</h2>
                                        <h3 className="text-indigo-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">
                                            {selectedProject.projectTitle}
                                        </h3>
                                    </header>

                                    {/* Key Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Contract Value</p>
                                            <p className="text-2xl font-bold text-emerald-400">${selectedProject.value.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Win Probability</p>
                                            <p className="text-2xl font-bold text-indigo-400">{selectedProject.probability || 85}%</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                                            Pipeline Velocity
                                            <div className="h-px flex-1 bg-white/5"></div>
                                        </h4>
                                        <div className="space-y-4 pt-2">
                                            <div className="relative">
                                                <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 p-[1px]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${getProgress(selectedProject.stage)}%` }}
                                                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-2 text-[9px] font-mono uppercase text-muted-foreground">
                                                    <span>Lead</span>
                                                    <span>Paid</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3 pt-4">
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs h-12 gap-2 shadow-[0_4px_15px_rgba(79,70,229,0.3)]">
                                            <Target className="h-4 w-4" />
                                            Move to Next Stage
                                        </Button>
                                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white font-bold uppercase text-xs h-12 gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            Open in Notion
                                        </Button>
                                        <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-bold uppercase">
                                            Mark as Lost
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-white/40 italic">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-[10px]">Updated {selectedProject.lastActivity}</span>
                                    </div>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

            </main>
        </div>
    )
}
