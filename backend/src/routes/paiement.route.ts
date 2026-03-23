import { FastifyReply, FastifyRequest } from 'fastify'
import { Route } from '../route.js'
import { generateTicketPDF, sendTicketEmail } from '../utils/pdf-mail.js'

export interface PaiementBody {
    nom: string; prenom: string; cb: string; date_expiration: string; cvv: string;
}

export const createPaiementRoute: Route = (app, { Trajet, Utilisateur }) => {
    app.post(
        '/paiement',
        async (request: FastifyRequest<{ Body: PaiementBody }>, reply: FastifyReply) => {
            const { nom, prenom, cb, date_expiration, cvv } = request.body
            const panier = request.session.panier
            if (!panier || panier.length === 0) return reply.status(400).send({ message: 'Panier vide' })

            const user = await Utilisateur.findById(request.session.userId).exec()
            if (!user) return reply.status(404).send({ message: 'Utilisateur non trouvé' })

            const num_auto = Math.random().toString(36).substring(2, 10).toUpperCase()
            const ref_resa = `RESA-${request.session.sessionId.slice(0, 8).toUpperCase()}`
            
            const articles = panier.map(item => ({ trajet: item.trajet, options: item.options, type: item.type }))
            user.factures.push({ articles, paiement: { nom, prenom, cb: `****-${cb.slice(-4)}`, numero_autorisation: num_auto } } as any)

            for (let i = 0; i < articles.length; i++) {
                user.billets.push({ reservation: articles[i], identifiant: `${num_auto}-${i + 1}` } as any)
            }
            await user.save()

            try {
                const billetsData = await Promise.all(articles.map(async (art, i) => {
                    const t = await Trajet.findById(art.trajet).exec()
                    return { billet: user.billets[user.billets.length - articles.length + i], trajet: t }
                }))
                const pdf = await generateTicketPDF(billetsData, `${nom} ${prenom}`)
                await sendTicketEmail(user.login, pdf, ref_resa)
            } catch (err) { console.error(err) }

            request.session.panier = []
            return { numero_autorisation: num_auto, reference: ref_resa }
        }
    )
}