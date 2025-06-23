import { FastifyInstance } from 'fastify'

import { createFornecedora } from './create-fornecedora'
import { deleteFornecedora } from './delete-fornecedora'
import { getAllFornecedoras } from './get-all-fornecedoras'
import { getFornecedora } from './get-fornecedora'
import { getFornecedoraByCnpj } from './get-fornecedora-by-cnpj'
import { listFornecedoras } from './list-fornecedoras'
import { updateFornecedora } from './update-fornecedora'

export default async function (app: FastifyInstance) {
  app.register(createFornecedora)
  app.register(deleteFornecedora)
  app.register(getAllFornecedoras)
  app.register(getFornecedora)
  app.register(listFornecedoras)
  app.register(updateFornecedora)
  app.register(getFornecedoraByCnpj)
}
