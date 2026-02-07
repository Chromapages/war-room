"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TeamMember, Department } from "@/app/team/data"
import { TeamCard } from "@/components/team-card"
import { TeamSheet } from "@/components/team-sheet"
import { Users, Filter, Loader2, Megaphone, Search, Globe, Palette, Server, Database, Briefcase, Terminal, Brain, Shuffle, TrendingUp, Calculator } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"

const DEPARTMENTS: Department[] = ['All', 'Marketing', 'Engineering', 'Operations', 'Strategy', 'Finance']

// Icon mapping for Firestore string -> Component
// Icon mapping for Firestore string -> Component
const ICON_MAP: Record<string, any> = {
    Megaphone, Search, Globe, Palette, Server, Database, Briefcase, Terminal, Brain, Shuffle, TrendingUp, Calculator
}

const CATEGORY_MAP: Record<string, string[]> = {
    Marketing: [
        'funnel-builder', 'social-media-manager', 'seo-autopilot', 'email-campaign-designer', 'copywriter',
        'lead-nurture-bot', 'marketing-strategist', 'social-ads-specialist', 'content-creator-lite',
        'content-repurposer', 'brand-voice-manager', 'campaign-analyzer', 'sms-marketer', 'storyteller'
    ],
    Engineering: [
        'frontend-builder', 'ui-designer', 'devops-manager', 'coding-agent', 'code-accelerator',
        'code-assistant', 'code-reviewer', 'tech-stack-auditor', 'github'
    ],
    Operations: [
        'client-ops-manager', 'business-ops', 'project-manager', 'hosting-manager', 'notion', 'google-sheets',
        'follow-up-ninja', 'ops-dashboard', 'recurring-health-check', 'usage-monitor'
    ],
    Strategy: [
        'chroma', 'decider', 'planner', 'researcher', 'brainstormer', 'idea-validator', 'facilitator',
        'challenger', 'advocate', 'analogist', 'critic', 'synthesizer', 'retrospector', 'mentor',
        'context-keeper', 'learning-curator'
    ],
    Finance: [
        'market-analyst', 'stock-researcher', 'crypto-analyst', 'technical-trader', 'portfolio-manager',
        'earnings-tracker', 'risk-assessor', 'options-strategist', 'estimator', 'pipeline-manager'
    ]
}

export default function TeamPage() {
    const [selectedDept, setSelectedDept] = useState<Department>('All')
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

    // State for Firestore data
    const [team, setTeam] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Subscribe to agents collection
        const q = query(collection(db, "agents"), orderBy("name"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const agentsData: TeamMember[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                // Map Firestore data to TeamMember interface
                // Note: Firestore stores icon as string, map it back to component
                agentsData.push({
                    id: doc.id,
                    name: data.name,
                    role: data.role,
                    department: data.department,
                    status: data.status,
                    model: data.model,
                    icon: ICON_MAP[data.iconName] || Users, // Fallback to Users icon
                    description: data.description,
                    capabilities: data.capabilities || []
                } as TeamMember)
            })
            setTeam(agentsData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching agents:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const filteredTeam = selectedDept === 'All'
        ? team
        : team.filter(m => {
            const allowedIds = CATEGORY_MAP[selectedDept] || []
            return allowedIds.includes(m.id)
        })

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 p-4 lg:p-8 overflow-x-hidden relative">
                {/* Ambient Background */}
                <div className="fixed inset-0 pointer-events-none z-[-1]">
                    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full"></div>
                </div>

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary/80 uppercase tracking-widest font-mono">Workforce Directory</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">AI Executive Workforce</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Command and control your specialized autonomous agents.
                            <span className="text-primary/70 ml-2 font-mono text-xs border border-primary/20 bg-primary/5 px-2 py-0.5 rounded">
                                {team.length} Active Neural Nodes
                            </span>
                        </p>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="mb-8 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                    {DEPARTMENTS.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className={cn(
                                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                selectedDept === dept
                                    ? "text-white"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            {selectedDept === dept && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{dept}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in">
                        <Loader2 className="h-10 w-10 mb-4 animate-spin text-primary" />
                        <p className="text-sm">Establishing connection to Neural Grid...</p>
                    </div>
                ) : (
                    <>
                        {/* Team Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            {filteredTeam.map((member) => (
                                <TeamCard
                                    key={member.id}
                                    member={member}
                                    onClick={() => setSelectedMember(member)}
                                />
                            ))}
                        </section>

                        {/* Empty State */}
                        {filteredTeam.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in zoom-in-95">
                                <Filter className="h-10 w-10 mb-4 opacity-20" />
                                <p>No agents deployed in this sector.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Detail Sheet */}
                <TeamSheet
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            </main>
        </div>
    )
}
