export type InteractionType = 'email' | 'meeting' | 'call' | 'sync'

export interface Interaction {
    id: string
    type: InteractionType
    date: string
    note: string
}

export interface NetworkContact {
    id: string
    name: string
    role: string
    status: string
    ltv: number
    healthScore: number
    lastContact: string
    avatarInitials: string
    email: string
    interactions: Interaction[]
}

// These values are now primarily in Firestore, 
// but we keep the structure here for reference and typing.
export const NETWORK_COLLECTION_SCHEMA = {
    name: "string",
    role: "string (Client/Partner)",
    status: "string (Active/Churn Risk/Critical)",
    ltv: "number",
    healthScore: "number (0-100)",
    lastContact: "string (e.g. '2 days ago')",
    avatarInitials: "string (2 chars)",
    email: "string",
    interactions: "array of objects"
}
