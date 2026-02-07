"use client"

import { useState } from "react"
import { ActionItem } from "@/lib/mock-data"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, Clock, Trash2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

function SwipeableCard({ item, onAction }: { item: ActionItem, onAction: (id: string, action: string) => void }) {
  const x = useMotionValue(0)
  const [exitX, setExitX] = useState<number | null>(null)

  // Feedback colors based on drag direction
  const backgroundColor = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(239, 68, 68, 0.2)", "rgba(15, 23, 42, 0.4)", "rgba(16, 185, 129, 0.2)"]
  )
  const opacity = useTransform(x, [-100, -50, 0, 50, 100], [0.5, 0.8, 1, 0.8, 0.5])

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(200)
      onAction(item.id, "Approve")
    } else if (info.offset.x < -100) {
      setExitX(-200)
      onAction(item.id, "Reject")
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        <div className="flex flex-col items-center gap-1 text-red-500 opacity-60">
          <Trash2 className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Reject</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-emerald-500 opacity-60">
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Approve</span>
        </div>
      </div>

      <motion.div
        style={{ x, backgroundColor, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={exitX ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
        className="relative z-10 cursor-grab active:cursor-grabbing"
      >
        <Card className="bg-transparent border-l-4 border-l-amber-500 border-white/5 shadow-xl transition-all">
          <CardHeader className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest">Action Required</span>
                  <Clock className="h-3 w-3 text-white/20" />
                </div>
                <CardTitle className="text-lg font-black text-white tracking-tight uppercase italic">{item.title}</CardTitle>
              </div>
              <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></div>
            </div>
            <CardDescription className="text-white/60 mt-3 font-mono text-xs leading-relaxed">
              {item.description}
            </CardDescription>

            {/* Mobile Swipe Hint */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/10 group-hover:text-white/20 transition-colors">
              <div className="h-px w-8 bg-current"></div>
              Swipe to Decide
              <div className="h-px w-8 bg-current"></div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}

export function BlockerBoard({ items }: { items: ActionItem[] }) {
  const [visibleItems, setVisibleItems] = useState(items)

  const handleAction = (id: string, action: string) => {
    console.log(`Action [${action}] triggered for item: ${id}`);
    // Simulate disappearance for tactile feel
    setTimeout(() => {
      setVisibleItems(prev => prev.filter(i => i.id !== id))
    }, 200)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <SwipeableCard item={item} onAction={handleAction} />
          </motion.div>
        ))}
        {visibleItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-12 flex flex-col items-center justify-center opacity-40 grayscale"
          >
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-500">Pipeline Clear</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
