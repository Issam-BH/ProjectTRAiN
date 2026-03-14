import { Schema } from 'mongoose'
import { required } from '../utils.js'
import { paiementSchema } from './paiement.schema.js'
import { reservationSchema } from './reservation.schema.js'

export const factureSchema = new Schema({
    articles: required([reservationSchema]),
    paiement: paiementSchema,
})
