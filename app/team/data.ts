import {
    Palette,
    Code,
    TrendingUp,
    Briefcase,
    Brain,
    Search,
    Megaphone,
    Database,
    Server,
    Terminal,
    Calculator,
    PenTool,
    Globe,
    Shuffle
} from "lucide-react"

export type Department = 'All' | 'Marketing' | 'Engineering' | 'Operations' | 'Strategy' | 'Finance'

export interface TeamMember {
    id: string
    name: string
    role: string
    department: Department
    status: 'active' | 'idle' | 'sleeping'
    model: 'Kimi K2.5' | 'Gemini Pro' | 'Antigravity'
    icon: any
    description: string
    capabilities: string[]
}

export const TEAMS: TeamMember[] = [
    // Marketing
    {
        id: "mkt-1",
        name: "Funnel Builder",
        role: "Growth Architect",
        department: 'Marketing',
        status: 'active',
        model: 'Kimi K2.5',
        icon: Megaphone,
        description: "Specializes in high-conversion landing page architecture and automated email sequences.",
        capabilities: ["Vercel Deployment", "Copywriting", "A/B Testing"]
    },
    {
        id: "mkt-2",
        name: "SEO Autopilot",
        role: "Content Strategist",
        department: 'Marketing',
        status: 'idle',
        model: 'Gemini Pro',
        icon: Search,
        description: "Autonomous keyword researcher and long-form content generator.",
        capabilities: ["Keyword Clustering", "Blog Generation", "Backlink Analysis"]
    },
    {
        id: "mkt-3",
        name: "Social Manager",
        role: "Brand Voice",
        department: 'Marketing',
        status: 'sleeping',
        model: 'Gemini Pro',
        icon: Globe,
        description: "Manages cross-platform social schedules and engagement responses.",
        capabilities: ["Sentiment Analysis", "Viral Hook Gen", "Schedule Optimization"]
    },

    // Engineering
    {
        id: "eng-1",
        name: "Frontend Builder",
        role: "UI Engineer",
        department: 'Engineering',
        status: 'active',
        model: 'Antigravity',
        icon: Palette,
        description: "Crafts pixel-perfect React/Next.js interfaces with TailwindCSS.",
        capabilities: ["React", "Framer Motion", "Component Design"]
    },
    {
        id: "eng-2",
        name: "DevOps Manager",
        role: "Infra Guardian",
        department: 'Engineering',
        status: 'idle',
        model: 'Antigravity',
        icon: Server,
        description: "Maintains CI/CD pipelines, Docker containers, and cloud infrastructure.",
        capabilities: ["Kubernetes", "AWS/GCP", "Security Auditing"]
    },
    {
        id: "eng-3",
        name: "Backend Architect",
        role: "System Designer",
        department: 'Engineering',
        status: 'active',
        model: 'Kimi K2.5',
        icon: Database,
        description: "Optimizes database schemas and API latency.",
        capabilities: ["PostgreSQL", "GraphQL", "Redis Caching"]
    },

    // Operations
    {
        id: "ops-1",
        name: "Client Ops",
        role: "Account Manager",
        department: 'Operations',
        status: 'active',
        model: 'Gemini Pro',
        icon: Briefcase,
        description: "Handles client onboarding, reporting, and retention flows.",
        capabilities: ["SLA Monitoring", "Invoice Gen", "Email Triage"]
    },
    {
        id: "ops-2",
        name: "Hosting Manager",
        role: "Site Reliability",
        department: 'Operations',
        status: 'sleeping',
        model: 'Gemini Pro',
        icon: Terminal,
        description: "Monitors uptime and responds to automated server alerts.",
        capabilities: ["Uptime Kuma", "Log Analysis", "Error Recovery"]
    },

    // Strategy
    {
        id: "strat-1",
        name: "The Decider",
        role: "Executive Function",
        department: 'Strategy',
        status: 'active',
        model: 'Kimi K2.5',
        icon: Brain,
        description: "High-level reasoning agent for complex business logic and conflict resolution.",
        capabilities: ["Game Theory", "Risk Assessment", "Resource Allocation"]
    },
    {
        id: "strat-2",
        name: "Market Researcher",
        role: "Data Scout",
        department: 'Strategy',
        status: 'idle',
        model: 'Gemini Pro',
        icon: Shuffle,
        description: "Scrapes and synthesizes competitor data and market trends.",
        capabilities: ["Web Scraping", "Trend Analysis", "Report Synthesis"]
    },

    // Finance
    {
        id: "fin-1",
        name: "Market Analyst",
        role: "Quant",
        department: 'Finance',
        status: 'active',
        model: 'Antigravity',
        icon: TrendingUp,
        description: "Real-time financial modeling and revenue forecasting.",
        capabilities: ["Forecasting", "Spreadsheet Automation", "P&L Analysis"]
    },
    {
        id: "fin-2",
        name: "Crypto Analyst",
        role: "Portfolio Manager",
        department: 'Finance',
        status: 'sleeping',
        model: 'Kimi K2.5',
        icon: Calculator,
        description: "Monitors chain metrics and rebalances treasury assets.",
        capabilities: ["Chain Analysis", "Smart Contract Auditing", "Yield Optimization"]
    }
]
