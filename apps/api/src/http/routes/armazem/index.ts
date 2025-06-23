import { FastifyInstance } from 'fastify'

import { createArmazem } from './create-armazem'
import { deleteArmazem } from './delete-armazem'
import { getAllArmazens } from './get-all-armazens'
import { getArmazem } from './get-armazem'
import { listArmazens } from './list-armazens'
import { updateArmazem } from './update-armazem'

export default async function (app: FastifyInstance) {
  app.register(createArmazem)
  app.register(deleteArmazem)
  app.register(getAllArmazens)
  app.register(getArmazem)
  app.register(listArmazens)
  app.register(updateArmazem)
}
