import { FastifyReply, FastifyRequest } from 'fastify'
import { Route } from '../route.js'

export const createBilletRoute: Route = (app, { Trajet }) => {
    /**
     * US 8.1.1 - Recherche d'un billet par son numéro de réservation
     */
    app.get(
        '/billets/:reference',
        async (
            request: FastifyRequest<{ Params: { reference: string } }>,
            reply: FastifyReply,
        ) => {
            const { reference } = request.params
            const { paiement, panier } = request.session

            // Vérification si la référence correspond à la session actuelle
            const currentRef = `RESA-${request.session.sessionId.slice(0, 8).toUpperCase()}`

            if (
                reference !== currentRef &&
                reference !== paiement?.numero_autorisation
            ) {
                return reply
                    .status(404)
                    .send({ message: 'Réservation non trouvée' })
            }

            if (!panier || panier.length === 0) {
                return reply.status(400).send({
                    message: 'Aucun billet associé à cette réservation',
                })
            }

            // Récupération des détails complets pour l'affichage
            const billets = await Promise.all(
                panier.map(async (item, index) => {
                    const trajet = await Trajet.findById(item.trajet).exec()
                    return {
                        billet_id: `${reference}-${index + 1}`,
                        passager: `${paiement?.nom} ${paiement?.prenom}`,
                        trajet: trajet
                            ? {
                                  depart: trajet.gare_depart,
                                  arrivee: trajet.gare_arrivee,
                                  date: trajet.date,
                                  heure: trajet.heure_depart,
                              }
                            : null,
                        options: item.options,
                        type: item.type,
                    }
                }),
            )

            return { reference, billets }
        },
    )

    /**
     * US 8.1.3 - Impression du billet
     * Retourne les données formatées pour un affichage "Print-friendly"
     */
    app.get(
        '/billets/:reference/imprimer',
        async (request: FastifyRequest<{ Params: { reference: string } }>) => {
            const { reference } = request.params
            // On réutilise la logique de récupération
            const data = await app.inject({
                method: 'GET',
                url: `/billets/${reference}`,
            })

            return {
                ...(data.json() as any),
                date_impression: new Date().toISOString(),
                instructions:
                    'Veuillez présenter ce document lors du contrôle.',
            }
        },
    )
}
