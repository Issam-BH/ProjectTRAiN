import { FastifyReply, FastifyRequest } from 'fastify'
import { Route } from '../route.js'
import { generateTicketPDF, sendTicketEmail } from '../utils/pdf-mail.js'

export interface PaiementBody {
    nom: string
    prenom: string
    cb: string
    date_expiration: string
    cvv: string
}

export const createPaiementRoute: Route = (app, { Trajet, Utilisateur }) => {
    
    app.get('/paiement', async (request, reply) => {
        if (!request.session.userId) {
            return reply.status(401).send({ message: 'Vous devez être connecté pour accéder au paiement' })
        }

        const panier = request.session.panier
        if (!panier || panier.length === 0) {
            return reply.status(400).send({ message: 'Le panier est vide' })
        }

        let total = 0
        for (const item of panier) {
            const trajet = await Trajet.findById(item.trajet).exec()
            if (trajet) {
                total += item.type === 'aller-retour'
                        ? trajet.tarifs.prix_aller_retour
                        : trajet.tarifs.prix_aller_simple

                for (const opt of item.options) {
                    const optDispo = trajet.options_disponibles.find((od) => od.nom === opt.nom)
                    if (optDispo) total += optDispo.prix
                }
            }
        }

        return {
            reference: `RESA-${request.session.sessionId.slice(0, 8).toUpperCase()}`,
            montant_a_payer: total,
            devise: 'EUR',
        }
    })

    
    app.post(
        '/paiement',
        async (request: FastifyRequest<{ Body: PaiementBody }>, reply: FastifyReply) => {
            const { nom, prenom, cb, date_expiration, cvv } = request.body

            if (!request.session.userId) {
                return reply.status(401).send({ message: 'Vous devez être connecté pour effectuer un achat' })
            }

            if (!request.session.panier || request.session.panier.length === 0) {
                return reply.status(400).send({ message: 'Le panier est vide' })
            }

            if (!nom || !prenom || !cb || !date_expiration || !cvv) {
                return reply.status(400).send({ message: 'Toutes les informations de paiement sont requises' })
            }

            const user = await Utilisateur.findById(request.session.userId).exec()
            if (!user) {
                return reply.status(404).send({ message: 'Utilisateur non trouvé' })
            }

            await new Promise((resolve) => setTimeout(resolve, 1000))
            const numero_autorisation = Math.random().toString(36).substring(2, 10).toUpperCase()
            const reference_resa = `RESA-${request.session.sessionId.slice(0, 8).toUpperCase()}`

            const paiementInfos = {
                nom,
                prenom,
                cb: `****-****-****-${cb.slice(-4)}`,
                numero_autorisation,
            }

            const articles = request.session.panier.map((item) => ({
                trajet: item.trajet,
                options: item.options,
                type: item.type,
            }))

            user.factures.push({
                articles,
                paiement: paiementInfos,
            } as any)

            for (let i = 0; i < articles.length; i++) {
                user.billets.push({
                    reservation: articles[i],
                    identifiant: `${numero_autorisation}-${i + 1}`,
                } as any)
            }

            await user.save()

            // --- GENERATION DU PDF ET ENVOI PAR MAIL ---
            try {
                const premierTrajet = await Trajet.findById(articles[0].trajet).exec()
                if (premierTrajet) {
                    const dernierBilletCree = user.billets[user.billets.length - articles.length]
                    const pdfBuffer = await generateTicketPDF(dernierBilletCree, premierTrajet, `${nom} ${prenom}`)
                    
                    // On envoie à l'adresse login (email) de l'utilisateur
                    await sendTicketEmail(user.login, pdfBuffer, reference_resa)
                }
            } catch (err) {
                console.error("Erreur lors de la génération ou de l'envoi de l'email :", err)
            }
            // -------------------------------------------

            request.session.panier = []
            request.session.paiement = paiementInfos

            return {
                message: 'Paiement effectué et achat enregistré',
                numero_autorisation,
                reference: reference_resa,
            }
        }
    )
}