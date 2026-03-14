import { Schema, Types } from 'mongoose'
import { required } from '../utils.js'
import { optionSchema } from './option.schema.js'

export const reservationSchema = new Schema({
    trajet: required(Types.ObjectId),
    options: required([optionSchema]),
    type: required(String),
})
