"use client"

import { ActionItem } from "@/lib/mock-data"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function BlockerBoard({ items }: { items: ActionItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/40 backdrop-blur-md border-l-4 border-l-amber-500 border-white/5 shadow-xl hover:bg-card/60 transition-all group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-bold text-white tracking-tight">{item.title}</CardTitle>
                <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse"></div>
              </div>
              <CardDescription className="text-white/60 line-clamp-2 mt-2 font-mono text-xs">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-2 gap-2">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white h-8 text-xs">
                <Clock className="w-3 h-3 mr-1" /> Later
              </Button>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                  <X className="w-3 h-3 mr-1" /> Reject
                </Button>
                <Button size="sm" variant="outline" className="h-8 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300">
                  <Check className="w-3 h-3 mr-1" /> Approve
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
