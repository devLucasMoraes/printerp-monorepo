import { FastifyInstance } from 'fastify'

import { createOrUpdateVinculo } from './create-or-update-vinculo'
import { getVinculoByCod } from './get-vinculo-by-cod'

export default async function (app: FastifyInstance) {
  app.register(getVinculoByCod)
  app.register(createOrUpdateVinculo)
}
