import { Mongoose } from 'mongoose'
import { trajetSchema } from '../schemas/trajet.schema.js'

export const createTrajet = (connection: Mongoose) =>
    connection.model('Trajet', trajetSchema)
