import { FastifyInstance } from 'fastify'

import { createTransportadora } from './create-transportadora'
import { deleteTransportadora } from './delete-transportadora'
import { getAllTransportadoras } from './get-all-transportadoras'
import { getTransportadora } from './get-transportadora'
import { getTransportadoraByCnpj } from './get-transportadora-by-cnpj'
import { listTransportadoras } from './list-transportadoras'
import { updateTransportadora } from './update-transportadora'

export default async function (app: FastifyInstance) {
  app.register(createTransportadora)
  app.register(deleteTransportadora)
  app.register(getAllTransportadoras)
  app.register(getTransportadora)
  app.register(listTransportadoras)
  app.register(updateTransportadora)
  app.register(getTransportadoraByCnpj)
}
