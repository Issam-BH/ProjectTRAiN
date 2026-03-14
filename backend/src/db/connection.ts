import { connect } from 'mongoose'
import { createTrajet } from './documents/trajet.document.js'
import { createUtilisateur } from './documents/utilisateur.document.js'

export async function createConnection(uri: string) {
    const connection = await connect(uri)

    const Utilisateur = createUtilisateur(connection)
    const Trajet = createTrajet(connection)

    return { connection, Utilisateur, Trajet }
}

export type DBConnection =
    ReturnType<typeof createConnection> extends Promise<infer T>
        ? T
        : ReturnType<typeof createConnection>
