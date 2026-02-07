"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Command,
    GitMerge,
    Share2,
    MessageSquareCode,
    Brain,
    Menu,
    X,
    Settings,
    Activity,
    Terminal,
    ShieldAlert,
    Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
    { href: "/dashboard", icon: Command, label: "Center" },
    { href: "/pipeline", icon: GitMerge, label: "Pipeline" },
    { href: "/network", icon: Share2, label: "Network" },
    { href: "/chat", icon: MessageSquareCode, label: "Terminal" },
    { href: "/memory", icon: Brain, label: "Memory" },
]

const MORE_ITEMS = [
    { href: "/team", icon: Users, label: "Team" },
    { href: "/blockers", icon: ShieldAlert, label: "Blockers" },
    { href: "/health", icon: Activity, label: "Health" },
    { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
    const pathname = usePathname()
    const [isMoreOpen, setIsMoreOpen] = useState(false)

    return (
        <>
            <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-lg">
                <div className="bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl h-18 px-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(79,70,229,0.1)] py-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} className="relative flex-1 min-w-[44px]">
                                <div className={cn(
                                    "flex flex-col items-center justify-center transition-all duration-300 py-2",
                                    isActive ? "text-cyan-400" : "text-muted-foreground/60"
                                )}>
                                    <item.icon className={cn(
                                        "h-6 w-6 transition-all",
                                        isActive && "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                                    )} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute -bottom-1 w-6 h-1 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)]"
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}

                    <button
                        onClick={() => setIsMoreOpen(true)}
                        className="flex-1 min-w-[44px] flex flex-col items-center justify-center text-muted-foreground/60 hover:text-white transition-all py-2"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">More</span>
                    </button>
                </div>
            </nav>

            {/* Operation Hub Drawer */}
            <AnimatePresence>
                {isMoreOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMoreOpen(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[70] md:hidden"
                        />
                        <motion.aside
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 inset-x-0 bg-slate-950 border-t border-white/10 rounded-t-[40px] z-[80] md:hidden max-h-[70vh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
                        >
                            {/* Drag Handle */}
                            <div className="flex justify-center py-5">
                                <div className="w-16 h-1.5 bg-white/10 rounded-full" />
                            </div>

                            <div className="px-8 pb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                                        <Terminal className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">System Core</h2>
                                        <p className="text-[9px] font-mono text-cyan-500/60 uppercase">Operational Subsystems</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsMoreOpen(false)} className="h-12 w-12 text-muted-foreground hover:bg-white/5 rounded-full">
                                    <X className="h-7 w-7" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-4 pb-16">
                                {MORE_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMoreOpen(false)}
                                        className="flex items-center gap-4 p-5 rounded-3xl bg-white/2 border border-white/5 text-muted-foreground active:scale-95 active:bg-white/5 transition-all min-h-[72px]"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
