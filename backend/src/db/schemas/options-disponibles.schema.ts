import { Schema } from 'mongoose'
import { required } from '../utils.js'

export const optionsDisponiblesSchema = new Schema({
    nom: required(String),
    prix: required(Number),
    capacite: required(Number),
})
