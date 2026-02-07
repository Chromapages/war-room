"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { FirestoreLog } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { RefreshCw, Terminal } from "lucide-react"

export function AgentFeed({ logs }: { logs: FirestoreLog[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current && !isRefreshing) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, isRefreshing])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      const touch = e.touches[0]
      const startY = touch.clientY

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentY = moveEvent.touches[0].clientY
        const distance = currentY - startY
        if (distance > 0) {
          setPullDistance(Math.min(distance, 100))
        }
      }

      const handleTouchEnd = () => {
        if (pullDistance > 80) {
          triggerRefresh()
        }
        setPullDistance(0)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }

      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }
  }

  const triggerRefresh = () => {
    setIsRefreshing(true)
    // Simulate haptic/network delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  const getLevelColor = (level: FirestoreLog['status']) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-card/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5 relative"
      onTouchStart={handleTouchStart}
    >
      {/* Pull-to-refresh Visual Indicator */}
      <motion.div
        style={{ y: pullDistance - 40, opacity: pullDistance / 100 }}
        className="absolute top-0 w-full flex justify-center py-2 z-20 pointer-events-none"
      >
        <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-2">
          <RefreshCw className={cn("h-3 w-3", pullDistance > 80 && "animate-spin")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {pullDistance > 80 ? "Release to Sync" : "Pull to Refresh"}
          </span>
        </div>
      </motion.div>

      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-slate-900/60 flex justify-between items-center z-10">
        <h2 className="text-xs font-bold tracking-tight text-white/90 font-mono flex items-center uppercase tracking-[0.2em] italic">
          <Terminal className="h-3 w-3 text-indigo-500 mr-2" />
          Neural Feed
        </h2>
        <div className="flex items-center gap-2">
          {isRefreshing && <RefreshCw className="h-3 w-3 text-indigo-500 animate-spin" />}
          <Badge variant="outline" className="font-mono text-[9px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5">LIVE</Badge>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[11px] custom-scrollbar"
      >
        {logs.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 group"
          >
            <span className="text-muted-foreground shrink-0 w-[50px] text-[10px] pt-0.5 opacity-30 tabular-nums">
              {log.time_string}
            </span>
            <div className="flex-1 border-l-2 border-white/5 pl-3 py-0 group-hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={cn("font-bold text-[10px] uppercase tracking-wider", getLevelColor(log.status))}>
                  {log.agent}
                </span>
                <span className="h-0.5 w-0.5 rounded-full bg-white/10" />
                <span className="text-[9px] text-white/20 font-black">{log.status}</span>
              </div>
              <p className={cn("text-white/70 leading-relaxed font-sans", log.status === 'error' ? 'text-red-300' : '')}>
                {log.action}
              </p>
            </div>
          </motion.div>
        ))}
        <div className="h-4" />
      </div>

      {/* Glass Overlay on Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
    </div>
  )
}
