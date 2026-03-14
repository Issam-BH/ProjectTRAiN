import { Mongoose } from 'mongoose'
import { utilisateurSchema } from '../schemas/utilisateur.schema.js'

export const createUtilisateur = (connection: Mongoose) =>
    connection.model('Utilisateur', utilisateurSchema)
