"use client"

import { NetworkContact } from "@/app/network/data"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, RefreshCw, Calendar, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NetworkSheetProps {
    contact: NetworkContact | null
    onClose: () => void
}

export function NetworkSheet({ contact, onClose }: NetworkSheetProps) {
    if (!contact) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
            case 'Recurring': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case 'Churn Risk': return 'text-red-400 bg-red-400/10 border-red-400/20'
            default: return 'text-slate-400'
        }
    }

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
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {contact.avatarInitials}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{contact.name}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground uppercase tracking-widest">{contact.role}</span>
                                    <Badge variant="outline" className={cn("text-[10px] py-0 h-5 border-0", getStatusColor(contact.status))}>
                                        {contact.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={onClose} className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Health & LTV */}
                        <section className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                                <p className="text-[10px] text-muted-foreground uppercase mb-2">Relationship Health</p>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500",
                                            contact.healthScore > 80 ? "bg-emerald-500" :
                                                contact.healthScore > 50 ? "bg-amber-500" : "bg-red-500"
                                        )}
                                        style={{ width: `${contact.healthScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-xl font-bold text-white">{contact.healthScore}/100</span>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                                <p className="text-[10px] text-muted-foreground uppercase mb-2">Lifetime Value</p>
                                <span className="text-2xl font-bold text-white tracking-tight">${contact.ltv.toLocaleString()}</span>
                                <span className="text-[10px] text-emerald-400">+12% vs last year</span>
                            </div>
                        </section>

                        {/* Interaction Log */}
                        <section>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Interaction Log
                            </h3>
                            <div className="relative border-l border-white/5 pl-6 space-y-6">
                                {contact.interactions.map((interaction) => (
                                    <div key={interaction.id} className="relative">
                                        <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-800 border-2 border-slate-600"></div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-muted-foreground">{interaction.date}</span>
                                                <Badge variant="outline" className="text-[9px] h-4 py-0 uppercase bg-white/5 border-white/10 text-white/70">
                                                    {interaction.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                                                {interaction.note}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-slate-950/50 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                onClick={() => alert(`Drafting email to ${contact.email}...`)}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Draft Email
                            </Button>
                            <Button className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"
                                onClick={() => alert(`Syncing ${contact.name} to GoHighLevel...`)}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync GHL
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
