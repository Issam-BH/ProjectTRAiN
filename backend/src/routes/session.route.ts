import { Route } from '../route.js'

export const createSessionRoute: Route = (app) => {
    /**
     * US 7.1.1 & 7.1.2 - Obtenir le temps restant avant le time-out
     */
    app.get('/session/time-left', async (request) => {
        const { cookie } = request.session

        if (!cookie.maxAge) {
            return { timeLeft: -1, message: 'Aucune expiration configurée' }
        }

        return {
            timeLeft: cookie.maxAge / 1000,
            expires: cookie.expires,
        }
    })

    /**
     * US 7.1.3 - Fermeture de la session
     */
    app.delete('/session', async (request, reply) => {
        await request.session.destroy()
        return reply.send({ message: 'Session fermée avec succès' })
    })

    /**
     * Action de "continuer" (pour rafraîchir le timer sans faire d'autre action)
     */
    app.post('/session/refresh', async () => {
        return { message: 'Session prolongée' }
    })
}
