import { FastifyInstance } from 'fastify'

import { createRequisicaoEstoque } from './create-requisicao-estoque'
import { deleteRequisicaoEstoque } from './delete-requisicao-estoque'
import { getAllRequisicoesEstoque } from './get-all-requisicoes-estoque'
import { getRequisicaoEstoque } from './get-requisicao-estoque'
import { listRequisicaoEstoques } from './list-requisicoes-estoque'
import { updateRequisicaoEstoque } from './update-requisicao-estoque'

export default async function (app: FastifyInstance) {
  app.register(createRequisicaoEstoque)
  app.register(deleteRequisicaoEstoque)
  app.register(getAllRequisicoesEstoque)
  app.register(getRequisicaoEstoque)
  app.register(listRequisicaoEstoques)
  app.register(updateRequisicaoEstoque)
}
