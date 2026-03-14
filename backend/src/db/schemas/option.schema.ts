import { Schema } from 'mongoose'
import { required } from '../utils.js'

export const optionSchema = new Schema({
    nom: required(String),
})
