import { FastifyInstance } from 'fastify'

import { createNfeCompra } from './create-nfe-compra'
import { deleteNfeCompra } from './delete-nfe-compra'
import { getAllNfesCompra } from './get-all-nfes-compra'
import { getNfeCompra } from './get-nfe-compra'
import { listNfesCompra } from './list-nfes-compra'
import { updateNfeCompra } from './update-nfe-compra'

export default async function (app: FastifyInstance) {
  app.register(createNfeCompra)
  app.register(deleteNfeCompra)
  app.register(getAllNfesCompra)
  app.register(getNfeCompra)
  app.register(listNfesCompra)
  app.register(updateNfeCompra)
}
