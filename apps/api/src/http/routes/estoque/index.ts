import { FastifyInstance } from 'fastify'

import { adjustEstoque } from './adjust-estoque'
import { listEstoques } from './list-estoques'

export default async function (app: FastifyInstance) {
  app.register(adjustEstoque)
  app.register(listEstoques)
}
