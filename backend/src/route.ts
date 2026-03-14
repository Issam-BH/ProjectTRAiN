import { FastifyInstance } from 'fastify'
import { DBConnection } from './db/connection.js'

export type Route = (app: FastifyInstance, db: DBConnection) => void
