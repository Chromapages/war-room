"use client"

import { InfraStatus } from "@/lib/mock-data"
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

function QuotaBar({ label, value }: { label: string, value: number }) {
  const getColor = (val: number) => {
    if (val < 50) return 'bg-emerald-500/80';
    if (val < 80) return 'bg-amber-500/80';
    return 'bg-red-500/80';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        <span>{label}</span>
        <span className={value > 80 ? 'text-red-400 font-bold' : ''}>{value}%</span>
      </div>
      <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", getColor(value))} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function InfraGrid({ data }: { data: InfraStatus }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* VPS Status */}
      <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-lg">
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
               <StatusLight status={data.vps} />
               <span className="text-[10px] font-mono uppercase text-white/90">{data.vps}</span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Status */}
      <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Domains</CardTitle>
          <Globe className="h-3 w-3 text-primary/70" />
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
           <div className="flex items-center justify-between">
             <span className="text-sm font-medium text-white/90 truncate max-w-[150px]">unionnational.com</span>
             <StatusLight status={data.domain} />
           </div>
           <div className="flex items-center justify-between">
             <span className="text-sm font-medium text-white/90 truncate max-w-[150px]">chromapages.com</span>
             <StatusLight status="active" />
           </div>
        </CardContent>
      </Card>

      {/* API Quotas */}
      <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">API Usage</CardTitle>
          <Cpu className="h-3 w-3 text-primary/70" />
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-3">
           <QuotaBar label="Claude 3.5" value={data.quota.claude} />
           <QuotaBar label="Gemini Pro" value={data.quota.gemini} />
           <QuotaBar label="OpenAI" value={data.quota.openai} />
        </CardContent>
      </Card>
    </div>
  )
}
