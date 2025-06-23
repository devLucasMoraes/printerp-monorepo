import { FastifyInstance } from 'fastify'

import { createCategoria } from './create-categoria'
import { deleteCategoria } from './delete-categoria'
import { getAllCategorias } from './get-all-categorias'
import { getCategoria } from './get-categoria'
import { listCategorias } from './list-categorias'
import { updateCategoria } from './update-categoria'

export default async function (app: FastifyInstance) {
  app.register(createCategoria)
  app.register(deleteCategoria)
  app.register(getCategoria)
  app.register(getAllCategorias)
  app.register(updateCategoria)
  app.register(listCategorias)
}
