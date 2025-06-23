import { FastifyInstance } from 'fastify'

import { createInsumo } from './create-insumo'
import { deleteInsumo } from './delete-insumo'
import { getAllInsumos } from './get-all-insumos'
import { getInsumo } from './get-insumo'
import { listInsumos } from './list-insumos'
import { updateInsumo } from './update-insumo'

export default async function (app: FastifyInstance) {
  app.register(createInsumo)
  app.register(getInsumo)
  app.register(getAllInsumos)
  app.register(listInsumos)
  app.register(updateInsumo)
  app.register(deleteInsumo)
}
