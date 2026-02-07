"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
} | null>(null)

export function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange: controlledOnValueChange,
    children,
    className
}: {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    className?: string
}) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "")
    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
    const onValueChange = controlledOnValueChange !== undefined ? controlledOnValueChange : setUncontrolledValue

    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-white/5 p-1 text-muted-foreground border border-white/5", className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
    const context = React.useContext(TabsContext)
    if (!context) return null

    const isActive = context.value === value

    return (
        <button
            type="button"
            onClick={() => context.onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-primary text-white shadow-md" : "hover:bg-white/5 hover:text-white",
                className
            )}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
    const context = React.useContext(TabsContext)
    if (!context || context.value !== value) return null

    return <div className={cn("mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", className)}>{children}</div>
}
