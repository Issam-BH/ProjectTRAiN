import { FastifyRequest } from 'fastify'
import { Route } from '../route.js'

export const createTrajetRoute: Route = (app, { Trajet }) => {
    /**
     * Récupère tous les trajets à parir d'aujourd'hui
     */
    app.get('/trajets', async (request) => {
        const query = request.query as {
            gare_depart?: string
            gare_arrivee?: string
            date?: string
        }

        const filter: Record<string, any> = {
            date: {
                $gte: new Date(),
            },
        }

        if (query.gare_depart) {
            filter.gare_depart = query.gare_depart
        }

        if (query.gare_arrivee) {
            filter.gare_arrivee = query.gare_arrivee
        }

        if (query.date) {
            const searchDate = new Date(query.date)
            const nextDate = new Date(searchDate)
            nextDate.setDate(searchDate.getDate() + 1)
            filter.date = {
                $gte: searchDate,
                $lt: nextDate,
            }
        }

        return await Trajet.find(filter).exec()
    })

    /**
     * Récupère le calendrier des trajets avec les prix minimums par jour
     */
    app.get('/trajets/calendrier', async (request, res) => {
        const query = request.query as {
            gare_depart?: string
            gare_arrivee?: string
            date_debut?: string
            date_fin?: string
        }

        if (!query.gare_depart || !query.gare_arrivee) {
            return res.status(400).send({
                message:
                    'Les paramètres gare_depart et gare_arrivee sont requis.',
            })
        }

        const match: Record<string, any> = {
            gare_depart: query.gare_depart,
            gare_arrivee: query.gare_arrivee,
        }

        if (query.date_debut || query.date_fin) {
            match.date = {}
            if (query.date_debut) match.date.$gte = new Date(query.date_debut)
            if (query.date_fin) match.date.$lte = new Date(query.date_fin)
        } else {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            match.date = { $gte: today }
        }

        const calendrier = await Trajet.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' },
                    },
                    prix_minimum: { $min: '$tarifs.prix_aller_simple' },
                    trajets_disponibles: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    prix_minimum: 1,
                    trajets_disponibles: 1,
                },
            },
        ]).exec()

        return calendrier
    })

    /**
     * Récupère les détails d'un trajet par son ID
     */
    app.get(
        '/trajets/:id',
        async (request: FastifyRequest<{ Params: { id: string } }>, res) => {
            const { id } = request.params
            const trajet = await Trajet.findById(id).exec()

            if (!trajet) {
                return res.status(404).send({ message: 'Trajet non trouvé' })
            }

            return trajet
        },
    )
}
