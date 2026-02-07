"use client"

import { FirestoreStats } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Globe, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

function StatusLight({ status }: { status: string }) {
  const getColor = () => {
    if (['healthy', 'active'].includes(status)) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
    if (['degraded', 'expiring'].includes(status)) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
    return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
  }

  return (
    <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse", getColor())} />
  )
}

function QuotaBar({ label, value, colorClass, displayValue }: { label: string, value: number, colorClass?: string, displayValue?: string }) {
  const getStatusColor = (val: number) => {
    if (val < 20) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
    if (val < 50) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
    return colorClass || 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <div className={cn("h-1 w-1 rounded-full", getStatusColor(value))} />
          {label}
        </span>
        <span className={cn(value < 20 ? 'text-red-400 font-bold' : 'text-white/70')}>{displayValue || `${value}%`}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", getStatusColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function InfraGrid({ data }: { data: FirestoreStats }) {
  const displayQuotas = data.quotas || {
    gemini: 18,
    claude: 85,
    openai: 92
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* VPS Status */}
      <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">System Health</CardTitle>
          <Server className="h-3 w-3 text-primary/70" />
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">VPS-01</span>
              <span className="text-[10px] text-muted-foreground font-mono">Hostinger • 4 vCPU</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded border border-white/5">
              <StatusLight status={data.vps_health} />
              <span className="text-[10px] font-mono uppercase text-white/90">{data.vps_health}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Status */}
      <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Live Assets</CardTitle>
          <Globe className="h-3 w-3 text-primary/70" />
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/90">Active Agents</span>
            <span className="text-xl font-bold text-primary">{data.active_agents}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Status</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold">OPERATIONAL</span>
              <StatusLight status="healthy" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Health / API Quotas */}
      <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-colors"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
          <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Model Health</CardTitle>
          <Cpu className="h-3 w-3 text-primary/70" />
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          <QuotaBar
            label="Antigravity (Google)"
            value={displayQuotas.gemini}
            colorClass="bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
          />
          <QuotaBar
            label="Kimi K2.5"
            value={100}
            displayValue="∞"
            colorClass="bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
          />
        </CardContent>
      </Card>
    </div>
  )
}
