import { Schema } from 'mongoose'
import { required } from '../utils.js'

export const tarifsSchema = new Schema({
    prix_aller_simple: required(Number),
    prix_aller_retour: required(Number),
})
