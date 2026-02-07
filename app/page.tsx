"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-mono">
      <div className="flex flex-col items-center gap-4">
        <div className="h-4 w-4 rounded-full bg-indigo-500 animate-pulse"></div>
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">Redirecting to Command Center...</p>
      </div>
    </div>
  )
}
