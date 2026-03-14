import { FastifyReply, FastifyRequest } from 'fastify'
import { Route } from '../route.js'

export interface PaiementBody {
    nom: string
    prenom: string
    cb: string
    date_expiration: string
    cvv: string
}

export const createPaiementRoute: Route = (app, { Trajet, Utilisateur }) => {
    /**
     * US 6.1.1 - Rappel de la référence de résa et montant
     * Nécessite maintenant d'être connecté
     */
    app.get('/paiement', async (request, reply) => {
        if (!request.session.userId) {
            return reply
                .status(401)
                .send({ message: 'Vous devez être connecté pour accéder au paiement' })
        }

        const panier = request.session.panier
        if (!panier || panier.length === 0) {
            return reply.status(400).send({ message: 'Le panier est vide' })
        }

        // Calcul du montant total
        let total = 0
        for (const item of panier) {
            const trajet = await Trajet.findById(item.trajet).exec()
            if (trajet) {
                total +=
                    item.type === 'aller-retour'
                        ? trajet.tarifs.prix_aller_retour
                        : trajet.tarifs.prix_aller_simple

                for (const opt of item.options) {
                    const optDispo = trajet.options_disponibles.find(
                        (od) => od.nom === opt.nom,
                    )
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

    /**
     * US 6.1.2 & 6.1.3 - Saisir les infos, autorisation ET persistance
     */
    app.post(
        '/paiement',
        async (
            request: FastifyRequest<{ Body: PaiementBody }>,
            reply: FastifyReply,
        ) => {
            const { nom, prenom, cb, date_expiration, cvv } = request.body

            // 1. Vérification de l'authentification
            if (!request.session.userId) {
                return reply
                    .status(401)
                    .send({ message: 'Vous devez être connecté pour effectuer un achat' })
            }

            // 2. Vérification du panier
            if (!request.session.panier || request.session.panier.length === 0) {
                return reply.status(400).send({ message: 'Le panier est vide' })
            }

            // 3. Vérification des données bancaires
            if (!nom || !prenom || !cb || !date_expiration || !cvv) {
                return reply.status(400).send({
                    message: 'Toutes les informations de paiement sont requises',
                })
            }

            // 4. Récupération de l'utilisateur
            const user = await Utilisateur.findById(request.session.userId).exec()
            if (!user) {
                return reply.status(404).send({ message: 'Utilisateur non trouvé' })
            }

            // 5. Simulation bancaire
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const numero_autorisation = Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()

            const paiementInfos = {
                nom,
                prenom,
                cb: `****-****-****-${cb.slice(-4)}`,
                numero_autorisation,
            }

            // 6. Persistance en base de données
            const articles = request.session.panier.map((item) => ({
                trajet: item.trajet,
                options: item.options,
                type: item.type,
            }))

            // Ajout à l'historique des factures
            user.factures.push({
                articles,
                paiement: paiementInfos,
            } as any)

            // Génération et ajout des billets
            for (let i = 0; i < articles.length; i++) {
                user.billets.push({
                    reservation: articles[i],
                    identifiant: `${numero_autorisation}-${i + 1}`,
                } as any)
            }

            await user.save()

            // 7. Nettoyage de la session et réponse
            const response = {
                message: 'Paiement effectué et achat enregistré',
                numero_autorisation,
                reference: `RESA-${request.session.sessionId.slice(0, 8).toUpperCase()}`,
            }

            request.session.panier = []
            request.session.paiement = paiementInfos

            return response
        },
    )
}
