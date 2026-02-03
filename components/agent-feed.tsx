"use client"

import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { AgentLog } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AgentFeed({ logs }: { logs: AgentLog[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLevelColor = (level: AgentLog['level']) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-md border rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
      <div className="p-4 border-b bg-card/60 flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tight text-white/90 font-mono flex items-center">
          <span className="text-primary mr-2 animate-pulse">●</span>
          AGENT LOG
        </h2>
        <Badge variant="outline" className="font-mono text-xs border-white/10">LIVE</Badge>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-muted-foreground shrink-0 w-[64px] text-xs pt-0.5 opacity-50 tabular-nums">
              {log.timestamp}
            </span>
            <div className="flex-1 border-l-2 border-white/5 pl-3 py-0 group-hover:border-primary/50 transition-colors">
               <div className="flex items-center gap-2 mb-0.5">
                 <span className={cn("font-bold text-xs uppercase tracking-wider", getLevelColor(log.level))}>
                   {log.agent}
                 </span>
               </div>
               <p className={cn("text-white/80 leading-relaxed", log.level === 'error' ? 'text-red-200' : '')}>
                 {log.message}
               </p>
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}
