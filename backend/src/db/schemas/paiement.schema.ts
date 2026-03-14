import { Schema } from 'mongoose'
import { required } from '../utils.js'

export const paiementSchema = new Schema({
    nom: required(String),
    prenom: required(String),
    cb: required(String),
    numero_autorisation: required(String),
})
