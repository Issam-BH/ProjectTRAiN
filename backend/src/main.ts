import './session.js'

import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fastifyStatic from '@fastify/static'
import fastify from 'fastify'
import path from 'node:path'
import {
    COOKIE_SECRET,
    DEV,
    MONGODB_URI,
    SESSION_TIMEOUT_MS,
} from './config.js'
import { createConnection } from './db/connection.js'
import { Route } from './route.js'
import { createBilletRoute } from './routes/billet.route.js'
import { createOptionRoute } from './routes/option.route.js'
import { createPaiementRoute } from './routes/paiement.route.js'
import { createPanierRoute } from './routes/panier.route.js'
import { createSessionRoute } from './routes/session.route.js'
import { createTrajetRoute } from './routes/trajet.route.js'
import { createUtilisateurRoute } from './routes/utilisateur.route.js'

const routes: Route[] = [
    createTrajetRoute,
    createOptionRoute,
    createPanierRoute,
    createPaiementRoute,
    createSessionRoute,
    createBilletRoute,
    createUtilisateurRoute,
]

async function main() {
    const app = fastify()

    app.register(fastifyCookie)
    app.register(fastifySession, {
        secret: COOKIE_SECRET,
        cookie: {
            secure: !DEV,
            maxAge: SESSION_TIMEOUT_MS, // US 7.1.1 & 7.1.2 - Gestion du temps (3mn)
        },
        rolling: true, // Renouvelle le timer à chaque activité (sliding window)
    })

    const db = await createConnection(MONGODB_URI)

    app.register((app) => {
        for (const route of routes) {
            route(app, db)
        }
    }, { prefix: '/api' })

    app.register(fastifyStatic, {
        root: path.join(__dirname, './public')
    })


    app.listen({ port: 3000, host: '0.0.0.0' })
}

main()
