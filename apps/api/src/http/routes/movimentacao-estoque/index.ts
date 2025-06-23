import { FastifyInstance } from 'fastify'

import { listMovimentacoesEstoque } from './list-movimentacoes-estoque'

export default async function (app: FastifyInstance) {
  app.register(listMovimentacoesEstoque)
}
