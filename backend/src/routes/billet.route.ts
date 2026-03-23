import { FastifyReply, FastifyRequest } from 'fastify'
import { Route } from '../route.js'
import { generateTicketPDF } from '../utils/pdf-mail.js'

export const createBilletRoute: Route = (app, { Trajet, Utilisateur }) => {
    
    app.get(
        '/billets/:reference',
        async (request: FastifyRequest<{ Params: { reference: string } }>, reply: FastifyReply) => {
            const { reference } = request.params
            const { paiement, panier } = request.session

            const currentRef = `RESA-${request.session.sessionId.slice(0, 8).toUpperCase()}`

            if (reference !== currentRef && reference !== paiement?.numero_autorisation) {
                return reply.status(404).send({ message: 'Réservation non trouvée' })
            }

            if (!panier || panier.length === 0) {
                return reply.status(400).send({ message: 'Aucun billet associé à cette réservation' })
            }

            const billets = await Promise.all(
                panier.map(async (item, index) => {
                    const trajet = await Trajet.findById(item.trajet).exec()
                    return {
                        billet_id: `${reference}-${index + 1}`,
                        passager: `${paiement?.nom} ${paiement?.prenom}`,
                        trajet: trajet ? {
                                  depart: trajet.gare_depart,
                                  arrivee: trajet.gare_arrivee,
                                  date: trajet.date,
                                  heure: trajet.heure_depart,
                              } : null,
                        options: item.options,
                        type: item.type,
                    }
                }),
            )

            return { reference, billets }
        }
    )

    app.get(
        '/billets/:reference/imprimer',
        async (request: FastifyRequest<{ Params: { reference: string } }>) => {
            const { reference } = request.params
            const data = await app.inject({ method: 'GET', url: `/billets/${reference}` })

            return {
                ...(data.json() as any),
                date_impression: new Date().toISOString(),
                instructions: 'Veuillez présenter ce document lors du contrôle.',
            }
        }
    )

    // --- NOUVELLE ROUTE : Télécharger le PDF d'un billet précis ---
    app.get(
        '/billets/:identifiant/pdf',
        async (request: FastifyRequest<{ Params: { identifiant: string } }>, reply: FastifyReply) => {
            if (!request.session.userId) {
                return reply.status(401).send({ message: 'Vous devez être connecté' })
            }

            const user = await Utilisateur.findById(request.session.userId).exec()
            if (!user) return reply.status(404).send({ message: 'Utilisateur introuvable' })

            // Trouver le billet correspondant dans le compte de l'utilisateur
            const billet = user.billets.find((b: any) => b.identifiant === request.params.identifiant)
            if (!billet) return reply.status(404).send({ message: 'Billet non trouvé dans votre compte' })

            const trajet = await Trajet.findById(billet.reservation.trajet).exec()
            if (!trajet) return reply.status(404).send({ message: 'Trajet introuvable' })

            // Génération à la volée
            const pdfBuffer = await generateTicketPDF(billet, trajet, `${user.nom} ${user.prenom}`)

            // Forcer le téléchargement côté navigateur
            reply.header('Content-Type', 'application/pdf')
            reply.header('Content-Disposition', `attachment; filename="billet-${billet.identifiant}.pdf"`)
            
            return reply.send(pdfBuffer)
        }
    )
}