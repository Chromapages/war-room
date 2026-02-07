"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { NetworkContact } from "@/app/network/data"
import { NetworkSheet } from "@/components/network-sheet"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { Share2, Users, Search, ArrowUpRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function NetworkPage() {
    const [contacts, setContacts] = useState<NetworkContact[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<NetworkContact | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const q = query(collection(db, "network"), orderBy("ltv", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: NetworkContact[] = []
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as NetworkContact)
            })
            setContacts(data)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching network:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const filteredData = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase()
        if (s.includes('active') || s.includes('recurring')) return "bg-emerald-500"
        if (s.includes('risk') || s.includes('at risk')) return "bg-amber-500"
        if (s.includes('critical') || s.includes('churned')) return "bg-red-500"
        return "bg-slate-500"
    }

    const getNodeSize = (ltv: number) => {
        // Map LTV to size between 32px and 80px
        const base = 32
        const bonus = Math.min(ltv / 300, 48)
        return base + bonus
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30">
            <Sidebar />

            <main className="flex-1 ml-16 lg:ml-64 relative overflow-x-hidden">

                {/* Network Graph (Hero) */}
                <section className="h-[450px] relative w-full bg-slate-950 overflow-hidden border-b border-white/5">
                    {/* Graph Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>

                    {loading ? (
                        <div className="relative h-full w-full flex flex-col items-center justify-center text-muted-foreground font-mono">
                            <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-500" />
                            <span className="text-[10px] uppercase tracking-[0.3em]">Mapping Topology...</span>
                        </div>
                    ) : (
                        <div className="relative h-full w-full flex items-center justify-center">
                            {/* Central Node */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute z-20 h-24 w-24 rounded-full bg-slate-950 border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center uppercase tracking-widest text-[8px] font-bold"
                            >
                                <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center backdrop-blur-sm">
                                    <Share2 className="h-8 w-8 text-indigo-400" />
                                </div>
                                <div className="absolute -bottom-8 text-indigo-300">Chroma HQ</div>
                            </motion.div>

                            {/* Satellite Nodes */}
                            {contacts.map((contact, i) => {
                                // Calculate position in circle
                                const angle = (i / contacts.length) * 2 * Math.PI
                                const radius = 170 // Distance from center
                                const x = Math.cos(angle) * radius
                                const y = Math.sin(angle) * radius

                                const size = getNodeSize(contact.ltv)

                                return (
                                    <motion.div
                                        key={contact.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="absolute z-10"
                                        style={{ x, y }}
                                    >
                                        {/* Connection Line */}
                                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20" style={{ left: -x, top: -y }}>
                                            <line x1="250" y1="250" x2={250 + x} y2={250 + y} stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                                        </svg>

                                        {/* Node */}
                                        <motion.button
                                            whileHover={{ scale: 1.1, zIndex: 30 }}
                                            onClick={() => setSelectedContact(contact)}
                                            className="group relative rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:border-indigo-500 transition-colors shadow-lg"
                                            style={{ width: size, height: size }}
                                        >
                                            <div className="text-[10px] font-bold text-white uppercase">{contact.avatarInitials}</div>
                                            {/* Health Dot */}
                                            <div className={cn(
                                                "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-slate-900",
                                                getStatusColor(contact.status)
                                            )} />

                                            {/* Hover Tag */}
                                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                                                {contact.name} (${contact.ltv.toLocaleString()})
                                            </div>
                                        </motion.button>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* Contact Table Section */}
                <section className="p-4 lg:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Business Topology</h2>
                            <p className="text-muted-foreground text-sm uppercase text-[10px] tracking-[0.2em] font-mono">Node count: {contacts.length}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search network..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-9 bg-white/5 border-white/10 focus:border-indigo-500/50 text-xs"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="h-9 border-white/10 hover:bg-white/5 text-xs">
                                <Users className="h-3.5 w-3.5 mr-2" />
                                Add Node
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-muted-foreground font-medium uppercase text-[9px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Node Identity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Health & LTV</th>
                                    <th className="px-6 py-4">Last Contact</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
                                            Pulling live data...
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
                                            No active nodes found
                                        </td>
                                    </tr>
                                ) : filteredData.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className="group hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white/80 border border-white/5 uppercase">
                                                    {contact.avatarInitials}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white group-hover:text-indigo-400 transition-colors text-sm">{contact.name}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase font-mono">{contact.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={cn(
                                                "font-mono text-[9px] uppercase border-0 bg-opacity-10 py-0",
                                                getStatusColor(contact.status).replace('bg-', 'text-').replace('500', '400'),
                                                getStatusColor(contact.status).replace('500', '400/10')
                                            )}>
                                                {contact.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1.5 w-32">
                                                <div className="flex justify-between text-[10px] font-mono">
                                                    <span className="text-white">${contact.ltv.toLocaleString()}</span>
                                                    <span className={cn(
                                                        contact.healthScore > 50 ? "text-emerald-400" : "text-red-400"
                                                    )}>{contact.healthScore}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all duration-1000",
                                                            contact.healthScore > 80 ? "bg-emerald-500" :
                                                                contact.healthScore > 50 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${contact.healthScore}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-mono text-[10px] uppercase">
                                            {contact.lastContact}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Detail Sheet */}
                <NetworkSheet
                    contact={selectedContact}
                    onClose={() => setSelectedContact(null)}
                />
            </main>
        </div>
    )
}
