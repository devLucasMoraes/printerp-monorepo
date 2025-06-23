import { FastifyInstance } from 'fastify'

import { createRequisitante } from './create-requisitante'
import { deleteRequisitante } from './delete-requisitante'
import { getAllRequisitantes } from './get-all-requisitantes'
import { getRequisitante } from './get-requisitante'
import { listRequisitantes } from './list-requisitantes'
import { updateRequisitante } from './update-requisitante'

export default async function (app: FastifyInstance) {
  app.register(createRequisitante)
  app.register(deleteRequisitante)
  app.register(getAllRequisitantes)
  app.register(getRequisitante)
  app.register(listRequisitantes)
  app.register(updateRequisitante)
}
