"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import {
    Settings as SettingsIcon,
    User,
    Key,
    Bell,
    Shield,
    Eye,
    EyeOff,
    Loader2,
    Save,
    Globe,
    Mail,
    Smartphone,
    Calendar
} from "lucide-react"

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})

    // State for config
    const [config, setConfig] = useState({
        name: "Eric Black",
        email: "commander@warroom.ai",
        openai_key: "sk-••••••••••••••••••••••••",
        gemini_key: "AIza••••••••••••••••••••••••",
        ghl_token: "tok_••••••••••••••••••••••••",
        email_alerts: true,
        push_notifications: false,
        daily_digest: true,
        theme: "dark"
    })

    const toggleKey = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // Mock Firestore Write
            await setDoc(doc(db, "settings", "config"), {
                ...config,
                updatedAt: new Date().toISOString()
            })
            alert("Settings saved successfully to Warp Room Core.")
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Critical Error: Failed to commit changes to Firestore.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Sidebar />

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
                        <div className="flex items-center gap-2 mb-1">
                            <SettingsIcon className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary/80 uppercase tracking-widest font-mono">System Parameters</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">War Room Config</h1>
                        <p className="text-sm text-muted-foreground mt-1">Configure your workspace and agent integrations.</p>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg min-w-[140px]"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {loading ? "Committing..." : "Save Changes"}
                    </Button>
                </header>

                <Tabs defaultValue="general" className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <TabsList className="mb-8 p-1">
                        <TabsTrigger value="general" className="gap-2">
                            <User className="h-4 w-4" /> General
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="gap-2">
                            <Key className="h-4 w-4" /> Integrations
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="gap-2">
                            <Bell className="h-4 w-4" /> Preferences
                        </TabsTrigger>
                    </TabsList>

                    {/* General Tab */}
                    <TabsContent value="general">
                        <div className="max-w-2xl space-y-6">
                            <Card className="bg-card/30 backdrop-blur-md border border-white/5 p-6">
                                <CardHeader className="px-0 pt-0 pb-6">
                                    <CardTitle className="text-lg">Executive Profile</CardTitle>
                                    <CardDescription>Personal information for command identity.</CardDescription>
                                </CardHeader>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 border-4 border-white/5 shadow-2xl relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Replace</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-white">Profile Avatar</p>
                                            <p className="text-xs text-muted-foreground">JPG, PNG or SVG. Max 2MB.</p>
                                            <Button variant="outline" size="sm" className="mt-2 h-8 border-white/10 hover:bg-white/5">Change Identity</Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Display Name</Label>
                                            <Input
                                                id="name"
                                                value={config.name}
                                                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Command Email</Label>
                                            <Input
                                                id="email"
                                                value={config.email}
                                                readOnly
                                                className="opacity-50 cursor-not-allowed bg-transparent"
                                            />
                                            <p className="text-[10px] text-muted-foreground italic">Email change requires central authentication reset.</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-card/30 backdrop-blur-md border border-white/5 p-6 border-red-500/10">
                                <CardHeader className="px-0 pt-0 pb-4 text-red-400">
                                    <CardTitle className="text-sm uppercase tracking-widest font-bold">Danger Zone</CardTitle>
                                </CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-white">Decommission War Room</p>
                                        <p className="text-xs text-muted-foreground">Permanently delete all data and agent logs.</p>
                                    </div>
                                    <Button variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40">Terminate Core</Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Integrations Tab */}
                    <TabsContent value="integrations">
                        <div className="max-w-2xl space-y-6">
                            <Card className="bg-card/30 backdrop-blur-md border border-white/5 p-6">
                                <CardHeader className="px-0 pt-0 pb-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield className="h-4 w-4 text-primary" />
                                        <CardTitle className="text-lg">AI Keys & Tokens</CardTitle>
                                    </div>
                                    <CardDescription>Secret credentials for agent model access.</CardDescription>
                                </CardHeader>

                                <div className="space-y-6">
                                    {/* OpenAI */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="openai">OpenAI API Key</Label>
                                            <button
                                                onClick={() => toggleKey('openai')}
                                                className="text-[10px] uppercase font-bold text-primary hover:underline flex items-center gap-1"
                                            >
                                                {showKeys['openai'] ? <><EyeOff className="h-3 w-3" /> Hide</> : <><Eye className="h-3 w-3" /> Show</>}
                                            </button>
                                        </div>
                                        <Input
                                            id="openai"
                                            type={showKeys['openai'] ? "text" : "password"}
                                            value={config.openai_key}
                                            onChange={(e) => setConfig({ ...config, openai_key: e.target.value })}
                                        />
                                    </div>

                                    {/* Gemini */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="gemini">Google Gemini Key</Label>
                                            <button
                                                onClick={() => toggleKey('gemini')}
                                                className="text-[10px] uppercase font-bold text-primary hover:underline flex items-center gap-1"
                                            >
                                                {showKeys['gemini'] ? <><EyeOff className="h-3 w-3" /> Hide</> : <><Eye className="h-3 w-3" /> Show</>}
                                            </button>
                                        </div>
                                        <Input
                                            id="gemini"
                                            type={showKeys['gemini'] ? "text" : "password"}
                                            value={config.gemini_key}
                                            onChange={(e) => setConfig({ ...config, gemini_key: e.target.value })}
                                        />
                                    </div>

                                    {/* GHL */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="ghl">GoHighLevel Token</Label>
                                            <button
                                                onClick={() => toggleKey('ghl')}
                                                className="text-[10px] uppercase font-bold text-primary hover:underline flex items-center gap-1"
                                            >
                                                {showKeys['ghl'] ? <><EyeOff className="h-3 w-3" /> Hide</> : <><Eye className="h-3 w-3" /> Show</>}
                                            </button>
                                        </div>
                                        <Input
                                            id="ghl"
                                            type={showKeys['ghl'] ? "text" : "password"}
                                            value={config.ghl_token}
                                            onChange={(e) => setConfig({ ...config, ghl_token: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </Card>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4">
                                <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">Secure Storage</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Keys are encrypted at rest and never exposed to agent LLMs directly without explicit runtime permission.</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences">
                        <div className="max-w-2xl space-y-6">
                            <Card className="bg-card/30 backdrop-blur-md border border-white/5 p-6">
                                <CardHeader className="px-0 pt-0 pb-6">
                                    <CardTitle className="text-lg">Communication Filters</CardTitle>
                                    <CardDescription>Control how the system notifies you of events.</CardDescription>
                                </CardHeader>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Mail className="h-4 w-4 text-white/70" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-white">Email Alerts</p>
                                                <p className="text-xs text-muted-foreground">Critical system updates and agent blockers.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={config.email_alerts}
                                            onCheckedChange={(checked) => setConfig({ ...config, email_alerts: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Smartphone className="h-4 w-4 text-white/70" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-white">Push Notifications</p>
                                                <p className="text-xs text-muted-foreground">Mobile alerts for real-time live logs.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={config.push_notifications}
                                            onCheckedChange={(checked) => setConfig({ ...config, push_notifications: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                <Calendar className="h-4 w-4 text-white/70" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-white">Daily Digest</p>
                                                <p className="text-xs text-muted-foreground">Summary of performance and MRR growth.</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={config.daily_digest}
                                            onCheckedChange={(checked) => setConfig({ ...config, daily_digest: checked })}
                                        />
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-card/30 backdrop-blur-md border border-white/5 p-6">
                                <CardHeader className="px-0 pt-0 pb-6">
                                    <CardTitle className="text-lg">Visual Theme</CardTitle>
                                    <CardDescription>Interface aesthetic for the command center.</CardDescription>
                                </CardHeader>

                                <div className="grid grid-cols-3 gap-4">
                                    {["System", "Dark", "Light"].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => t === "Dark" && setConfig({ ...config, theme: "dark" })}
                                            disabled={t !== "Dark"}
                                            className={`p-4 rounded-xl border transition-all text-center ${t === "Dark"
                                                    ? "border-primary bg-primary/10 text-white"
                                                    : "border-white/5 bg-white/5 text-muted-foreground opacity-50 cursor-not-allowed"
                                                }`}
                                        >
                                            <div className={`h-12 w-full rounded-md mb-2 ${t === "Dark" ? "bg-slate-950" : "bg-white"}`}></div>
                                            <span className="text-xs font-bold uppercase tracking-widest">{t}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-4 text-[10px] text-muted-foreground italic text-center">War Room protocol enforces "Dark Mode" for maximum contrast during operations.</p>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
