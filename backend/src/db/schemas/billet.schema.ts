import { Schema } from 'mongoose'
import { required } from '../utils.js'
import { reservationSchema } from './reservation.schema.js'

export const billetSchema = new Schema({
    reservation: required(reservationSchema),
    identifiant: required(String),
})
