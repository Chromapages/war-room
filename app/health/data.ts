export type ServiceStatus = 'online' | 'warning' | 'error' | 'syncing'

export interface APIHealth {
    id: string
    name: string
    status: ServiceStatus
    lastSync: string
    metricLabel?: string
    metricValue?: string
    message?: string
    countdown?: number // Special for Meta (days/hours/etc)
}

export const HEALTH_DATA: APIHealth[] = [
    {
        id: "ghl",
        name: "GoHighLevel",
        status: "online",
        lastSync: "2 min ago",
        metricLabel: "Total Contacts",
        metricValue: "12,402"
    },
    {
        id: "stripe",
        name: "Stripe",
        status: "online",
        lastSync: "15 min ago",
        metricLabel: "Pending Balance",
        metricValue: "$8,420.00"
    },
    {
        id: "notion",
        name: "Notion",
        status: "error",
        lastSync: "1 hour ago",
        metricLabel: "Last Jobs Sync",
        metricValue: "Failed",
        message: "401: Unauthorized access to Jobs Database Page."
    },
    {
        id: "meta",
        name: "Meta Business",
        status: "warning",
        lastSync: "7 days ago",
        metricLabel: "Verification Gate",
        metricValue: "Pending",
        countdown: 168, // 7 days in hours
        message: "Waiting for mandatory 7-day security cooldown."
    },
    {
        id: "firebase",
        name: "Firebase",
        status: "online",
        lastSync: "Real-time",
        metricLabel: "DB Latency",
        metricValue: "12ms"
    }
]
