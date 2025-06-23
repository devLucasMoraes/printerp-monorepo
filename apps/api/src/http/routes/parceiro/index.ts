import { FastifyInstance } from 'fastify'

import { createParceiro } from './create-parceiro'
import { deleteParceiro } from './delete-parceiro'
import { getAllParceiros } from './get-all-parceiros'
import { getParceiro } from './get-parceiro'
import { listParceiros } from './list-parceiro'
import { updateParceiro } from './update-parceiro'

export default async function (app: FastifyInstance) {
  app.register(createParceiro)
  app.register(deleteParceiro)
  app.register(getAllParceiros)
  app.register(getParceiro)
  app.register(listParceiros)
  app.register(updateParceiro)
}
