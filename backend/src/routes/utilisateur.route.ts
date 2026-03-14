import { FastifyReply, FastifyRequest } from 'fastify'
import argon2 from 'argon2'
import { Route } from '../route.js'

export const createUtilisateurRoute: Route = (app, { Utilisateur }) => {
    /**
     * Inscription d'un nouvel utilisateur
     */
    app.post(
        '/register',
        async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
            const { login, password, nom, prenom, numero_abonnement } = request.body as any

            if (!login || !password || !nom || !prenom) {
                return reply.status(400).send({ message: 'Tous les champs obligatoires sont requis' })
            }

            const existingUser = await Utilisateur.findOne({ login }).exec()
            if (existingUser) {
                return reply.status(400).send({ message: 'Cet utilisateur existe déjà' })
            }

            // Hachage du mot de passe avec Argon2id
            const hashedPassword = await argon2.hash(password, { type: argon2.argon2id })

            const newUser = new Utilisateur({
                login,
                password: hashedPassword,
                nom,
                prenom,
                numero_abonnement,
                factures: [],
                billets: []
            })

            await newUser.save()

            return reply.status(201).send({ message: 'Utilisateur créé avec succès' })
        }
    )

    /**
     * Connexion d'un utilisateur
     */
    app.post(
        '/login',
        async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
            const { login, password } = request.body as any

            const user = await Utilisateur.findOne({ login }).exec()
            if (!user) {
                return reply.status(401).send({ message: 'Identifiants invalides' })
            }

            const validPassword = await argon2.verify(user.password, password)
            if (!validPassword) {
                return reply.status(401).send({ message: 'Identifiants invalides' })
            }

            // Stockage de l'ID utilisateur en session
            request.session.userId = user._id.toString()

            return { message: 'Connexion réussie', user: { login: user.login, nom: user.nom, prenom: user.prenom } }
        }
    )

    /**
     * Déconnexion
     */
    app.post('/logout', async (request, reply) => {
        await request.session.destroy()
        return { message: 'Déconnexion réussie' }
    })

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    app.get('/me', async (request, reply) => {
        if (!request.session.userId) {
            return reply.status(401).send({ message: 'Non connecté' })
        }

        const user = await Utilisateur.findById(request.session.userId).select('-password').exec()
        if (!user) {
            return reply.status(404).send({ message: 'Utilisateur non trouvé' })
        }

        return user
    })
}
