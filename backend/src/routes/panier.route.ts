import { FastifyRequest } from 'fastify'
import { Route } from '../route.js'
import { PanierItem } from '../session.js'

export const createPanierRoute: Route = (app, { Trajet }) => {
    // S'assurer que le panier existe toujours dans la session
    app.addHook('preHandler', async (request) => {
        if (!request.session.panier) {
            request.session.panier = []
        }
    })

    /**
     * US 5.1.2 - Affichage de l’écran de récap de la résa
     * Calcule le récapitulatif complet du panier avec les prix
     */
    app.get('/panier/recapitulatif', async (request) => {
        const panier = request.session.panier
        let prixTotalGlobal = 0

        const articles = await Promise.all(
            panier.map(async (item) => {
                const trajet = await Trajet.findById(item.trajet).exec()
                if (!trajet) return null

                // Calcul du prix de base selon le type
                const prixBase =
                    item.type === 'aller-retour'
                        ? trajet.tarifs.prix_aller_retour
                        : trajet.tarifs.prix_aller_simple

                // Calcul du prix des options
                let prixOptions = 0
                const optionsDetails = item.options.map((opt) => {
                    const optDispo = trajet.options_disponibles.find(
                        (od) => od.nom === opt.nom,
                    )
                    const prix = optDispo ? optDispo.prix : 0
                    prixOptions += prix
                    return { nom: opt.nom, prix }
                })

                const sousTotal = prixBase + prixOptions
                prixTotalGlobal += sousTotal

                return {
                    trajet: {
                        id: trajet._id,
                        gare_depart: trajet.gare_depart,
                        gare_arrivee: trajet.gare_arrivee,
                        date: trajet.date,
                        heure_depart: trajet.heure_depart,
                    },
                    type: item.type,
                    prixBase,
                    options: optionsDetails,
                    sousTotal,
                }
            }),
        )

        const filteredArticles = articles.filter((a) => a !== null)

        return {
            articles: filteredArticles,
            prixTotal: prixTotalGlobal,
            nombreArticles: filteredArticles.length,
        }
    })

    /**
     * US 5.1.1 - Vérification des données saisies (Ajout au panier)
     */
    app.post(
        '/panier',
        async (request: FastifyRequest<{ Body: PanierItem }>, reply) => {
            const { trajet: trajetId, options, type } = request.body

            // 1. Vérification des champs obligatoires
            if (!trajetId || !type) {
                return reply
                    .status(400)
                    .send({ message: 'Le trajet et le type sont requis' })
            }

            // 2. Vérification de l'existence du trajet
            const trajet = await Trajet.findById(trajetId).exec()
            if (!trajet) {
                return reply.status(404).send({ message: 'Trajet non trouvé' })
            }

            // 3. Vérification de la validité du type
            if (type !== 'aller-simple' && type !== 'aller-retour') {
                return reply
                    .status(400)
                    .send({ message: 'Type de trajet invalide' })
            }

            // 4. Vérification de la validité des options
            if (options && options.length > 0) {
                for (const opt of options) {
                    const exists = trajet.options_disponibles.some(
                        (od) => od.nom === opt.nom,
                    )
                    if (!exists) {
                        return reply.status(400).send({
                            message: `L'option ${opt.nom} n'est pas disponible pour ce trajet`,
                        })
                    }
                }
            }

            // Ajout validé
            request.session.panier.push({
                trajet: trajetId,
                options: options ?? [],
                type,
            })

            return {
                message: 'Article ajouté et vérifié',
                panier: request.session.panier,
            }
        },
    )

    /**
     * US 5.1.3 - Suppression du panier
     */
    app.delete('/panier', async (request) => {
        request.session.panier = []
        return { message: 'Panier vidé' }
    })

    /**
     * Retrait d'article par index
     */
    app.delete(
        '/panier/:index',
        async (
            request: FastifyRequest<{ Params: { index: string } }>,
            reply,
        ) => {
            const index = Number.parseInt(request.params.index, 10)
            if (
                Number.isNaN(index) ||
                index < 0 ||
                index >= request.session.panier.length
            ) {
                return reply.status(404).send({ message: 'Article non trouvé' })
            }
            request.session.panier.splice(index, 1)
            return { message: 'Article retiré', panier: request.session.panier }
        },
    )
}
