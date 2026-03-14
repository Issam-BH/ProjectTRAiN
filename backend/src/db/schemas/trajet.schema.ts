import { Schema } from 'mongoose'
import { required } from '../utils.js'
import { optionsDisponiblesSchema } from './options-disponibles.schema.js'
import { tarifsSchema } from './tarifs.schema.js'

export const trajetSchema = new Schema({
    heure_depart: required(String),
    heure_arrive: required(String),

    gare_depart: required(String),
    gare_arrivee: required(String),

    date: required(Date),

    capacite: required(Number),
    options_disponibles: required([optionsDisponiblesSchema]),
    tarifs: required(tarifsSchema),
})
