import { Schema } from 'mongoose'
import { required } from '../utils.js'
import { billetSchema } from './billet.schema.js'
import { factureSchema } from './facture.schema.js'

export const utilisateurSchema = new Schema({
    login: required(String),
    password: required(String),

    nom: required(String),
    prenom: required(String),

    numero_abonnement: String,
    factures: required([factureSchema]),
    billets: required([billetSchema]),
})
