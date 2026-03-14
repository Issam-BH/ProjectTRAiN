import { FastifyReply, FastifyRequest } from 'fastify'
import { Route } from '../route.js'

export const createOptionRoute: Route = (app, { Trajet }) => {
    /**
     * Liste toutes les options disponibles et les prix associés pour un trajet donné
     */
    app.get(
        '/trajets/:id/options',
        async (
            request: FastifyRequest<{ Params: { id: string } }>,
            reply: FastifyReply,
        ) => {
            const { id } = request.params
            const trajet = await Trajet.findById(id).exec()

            if (!trajet) {
                return reply.status(404).send({ message: 'Trajet non trouvé' })
            }

            return trajet.options_disponibles
        },
    )
}
