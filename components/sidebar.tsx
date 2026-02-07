"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Terminal, Command, User, Settings, Users, Brain, MessageSquareCode, Share2, ShieldAlert, Activity, GitMerge } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { href: "/dashboard", icon: Command, label: "Dashboard" },
        { href: "/agents", icon: User, label: "Agents" },
        { href: "/team", icon: Users, label: "Team" },
        { href: "/chat", icon: MessageSquareCode, label: "Terminal" },
        { href: "/memory", icon: Brain, label: "Memory" },
        { href: "/network", icon: Share2, label: "Network" },
        { href: "/blockers", icon: ShieldAlert, label: "Blockers" },
        { href: "/health", icon: Activity, label: "Health" },
        { href: "/pipeline", icon: GitMerge, label: "Pipeline" },
        { href: "/settings", icon: Settings, label: "Settings" },
    ]

    return (
        <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col items-stretch py-8 bg-slate-950/50 backdrop-blur-3xl fixed inset-y-0 left-0 z-50">
            <div className="flex items-center px-8 mb-12 group cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                    <Terminal className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="ml-4 font-black tracking-[0.2em] text-sm text-white uppercase italic">WAR ROOM</span>
            </div>

            <nav className="flex-1 space-y-2 px-2 lg:px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.href} href={item.href} className="block">
                            <Button
                                variant="ghost"
                                className={`w-full justify-center lg:justify-start transition-all duration-300 ${isActive
                                    ? "text-white/90 bg-white/5 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-white/5"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 lg:mr-3 ${isActive ? "text-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""}`} />
                                <span className="hidden lg:inline">{item.label}</span>
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/5 mt-auto">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 border border-white/10 shadow-lg"></div>
                    <div className="hidden lg:block">
                        <p className="text-xs font-medium text-white">Eric Black</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Commander</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
