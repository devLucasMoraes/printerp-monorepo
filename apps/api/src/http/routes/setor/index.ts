import { FastifyInstance } from 'fastify'

import { createSetor } from './create-setor'
import { deleteSetor } from './delete-setor'
import { getAllSetores } from './get-all-setores'
import { getSetor } from './get-setor'
import { listSetores } from './list-setores'
import { updateSetor } from './update-setor'

export default async function (app: FastifyInstance) {
  app.register(updateSetor)
  app.register(listSetores)
  app.register(getSetor)
  app.register(getAllSetores)
  app.register(deleteSetor)
  app.register(createSetor)
}
