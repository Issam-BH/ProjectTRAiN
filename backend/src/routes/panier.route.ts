import { FastifyRequest } from 'fastify'
import { Route } from '../route.js'

interface PanierBody {
    trajet: string
    options: { nom: string }[]
    type: string
}

export const createPanierRoute: Route = (app, { Trajet }) => {
    app.get('/panier/recapitulatif', async (request) => {
        const panier = request.session.panier || []
        let prixTotalGlobal = 0

        const articles = await Promise.all(
            panier.map(async (item) => {
                const trajet = await Trajet.findById(item.trajet).exec()
                if (!trajet) return null

                // Utilisation du prix simple pour correspondre à la recherche de l'utilisateur
                let prixBase = trajet.tarifs.prix_aller_simple

                let prixOptionsArticle = 0
                const optionsDetails = item.options.map((opt) => {
                    const optDispo = trajet.options_disponibles.find((od) => od.nom === opt.nom)
                    const prix = optDispo ? optDispo.prix : 0
                    prixOptionsArticle += prix
                    return { nom: opt.nom, prix }
                })

                const sousTotal = prixBase + prixOptionsArticle
                prixTotalGlobal += sousTotal

                return {
                    trajet: {
                        id: trajet._id,
                        gare_depart: trajet.gare_depart,
                        gare_arrivee: trajet.gare_arrivee,
                        date: trajet.date,
                        heure_depart: trajet.heure_depart,
                    },
                    type: item.type === 'retour' ? 'Retour' : 'Aller',
                    prixBase,
                    options: optionsDetails,
                    sousTotal,
                }
            }),
        )

        const filtered = articles.filter((a) => a !== null)
        return { 
            articles: filtered, 
            prixTotal: Math.round(prixTotalGlobal * 100) / 100, 
            nombreArticles: filtered.length 
        }
    })

    app.post('/panier', async (request: FastifyRequest<{ Body: PanierBody }>, reply) => {
        const { trajet, options, type } = request.body
        if (!request.session.panier) request.session.panier = []
        request.session.panier.push({ trajet, options: options ?? [], type })
        return { message: 'OK' }
    })

    app.delete('/panier/:index', async (request: FastifyRequest<{ Params: { index: string } }>, reply) => {
        const index = parseInt(request.params.index)
        if (request.session.panier && request.session.panier[index]) {
            request.session.panier.splice(index, 1)
        }
        return { message: 'Retiré' }
    })
}