export interface PanierItem {
    trajet: string
    options: { nom: string }[]
    type: string
}

declare module 'fastify' {
    interface Session {
        panier: PanierItem[]
        paiement?: {
            nom: string
            prenom: string
            cb: string
            numero_autorisation: string
        }
        userId?: string
    }
}
