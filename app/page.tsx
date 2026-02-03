import { AgentFeed } from "@/components/agent-feed"
import { BlockerBoard } from "@/components/blocker-board"
import { InfraGrid } from "@/components/infra-grid"
import { MOCK_LOGS, MOCK_BLOCKERS, MOCK_INFRA } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Command, Settings, User, Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 border-r border-white/5 flex flex-col items-center lg:items-stretch py-6 bg-card/20 backdrop-blur-xl fixed inset-y-0 left-0 z-50">
        <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-8 group cursor-pointer">
           <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
             <Terminal className="h-4 w-4 text-primary" />
           </div>
           <span className="hidden lg:block ml-3 font-bold tracking-wider text-sm text-white/90">WAR ROOM</span>
        </div>
        
        <nav className="flex-1 space-y-2 px-2 lg:px-4">
          <Button variant="ghost" className="w-full justify-center lg:justify-start text-white/90 bg-white/5 hover:bg-white/10 hover:text-white">
             <Command className="h-5 w-5 lg:mr-3" />
             <span className="hidden lg:inline">Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-center lg:justify-start text-muted-foreground hover:text-white hover:bg-white/5">
             <User className="h-5 w-5 lg:mr-3" />
             <span className="hidden lg:inline">Agents</span>
          </Button>
          <Button variant="ghost" className="w-full justify-center lg:justify-start text-muted-foreground hover:text-white hover:bg-white/5">
             <Settings className="h-5 w-5 lg:mr-3" />
             <span className="hidden lg:inline">Settings</span>
          </Button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 border border-white/10 shadow-lg"></div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-white">Eric Black</p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Commander</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 lg:ml-64 p-4 lg:p-8 overflow-x-hidden relative">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full"></div>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
           <div>
             <h1 className="text-2xl font-bold tracking-tight text-white">Overview</h1>
             <p className="text-sm text-muted-foreground">System status and pending actions.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full relative hover:bg-white/5">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-white" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-black shadow-sm"></span>
              </Button>
           </div>
        </header>

        {/* Action Board (Blockers) */}
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
               Approvals Required
               <div className="h-px w-12 bg-white/10"></div>
             </h2>
             <Badge variant="secondary" className="rounded-sm px-2 text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">{MOCK_BLOCKERS.length} Pending</Badge>
           </div>
           <BlockerBoard items={MOCK_BLOCKERS} />
        </section>

        {/* Main Grid: Feed + Infra */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          
          {/* Agent Feed (2/3 width on large screens) */}
          <section className="xl:col-span-2 h-full flex flex-col min-h-[400px]">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 Live Operations
                 <div className="h-px w-12 bg-white/10"></div>
               </h2>
             </div>
             <div className="flex-1 min-h-0 relative">
               <AgentFeed logs={MOCK_LOGS} />
             </div>
          </section>

          {/* Infrastructure (1/3 width) */}
          <section className="h-full flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                   Infrastructure
                   <div className="h-px w-12 bg-white/10"></div>
                 </h2>
              </div>
              <InfraGrid data={MOCK_INFRA} />
            </div>
            
            {/* Financial Mini-Pulse */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                   Financial Pulse
                   <div className="h-px w-12 bg-white/10"></div>
                 </h2>
              </div>
              <div className="bg-gradient-to-br from-emerald-950/30 to-card/40 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors flex-1 shadow-lg backdrop-blur-sm">
                 <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                 
                 <div className="relative z-10">
                   <p className="text-xs font-mono text-emerald-400/80 mb-2 uppercase tracking-widest">Stripe MRR</p>
                   <p className="text-4xl font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">$12,450</p>
                   
                   <div className="mt-6 flex items-center gap-3">
                      <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold flex items-center border border-emerald-500/20">
                        ▲ 8.4%
                      </div>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                   </div>

                   <div className="mt-8 space-y-2">
                      <div className="flex justify-between text-xs text-white/60">
                         <span>Goal</span>
                         <span>$15,000</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] w-[83%] rounded-full"></div>
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
