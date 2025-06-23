import { FastifyInstance } from 'fastify'

import armazemRoutes from './armazem'
import authRoutes from './auth'
import categoriaRoutes from './categoria'
import chartRoutes from './chart'
import emprestimoRoutes from './emprestimo'
import estoqueRoutes from './estoque'
import fornecedoraRoutes from './fornecedora'
import insumoRoutes from './insumo'
import movimentacaoEstoqueRoutes from './movimentacao-estoque'
import nfeCompraRoutes from './nfe-compra'
import orgsRoutes from './orgs'
import parceiroRoutes from './parceiro'
import requisicaoEstoqueRoutes from './requisicao-estoque'
import requisitanteRoutes from './requisitante'
import setorRoutes from './setor'
import transportadoraRoutes from './transportadora'
import userRoutes from './user'
import vinculoRoutes from './vinculo'

export default async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/api/v1' })
  app.register(armazemRoutes, { prefix: '/api/v1' })
  app.register(categoriaRoutes, { prefix: '/api/v1' })
  app.register(chartRoutes, { prefix: '/api/v1' })
  app.register(emprestimoRoutes, { prefix: '/api/v1' })
  app.register(estoqueRoutes, { prefix: '/api/v1' })
  app.register(fornecedoraRoutes, { prefix: '/api/v1' })
  app.register(insumoRoutes, { prefix: '/api/v1' })
  app.register(movimentacaoEstoqueRoutes, { prefix: '/api/v1' })
  app.register(nfeCompraRoutes, { prefix: '/api/v1' })
  app.register(orgsRoutes, { prefix: '/api/v1' })
  app.register(parceiroRoutes, { prefix: '/api/v1' })
  app.register(requisicaoEstoqueRoutes, { prefix: '/api/v1' })
  app.register(requisitanteRoutes, { prefix: '/api/v1' })
  app.register(setorRoutes, { prefix: '/api/v1' })
  app.register(transportadoraRoutes, { prefix: '/api/v1' })
  app.register(userRoutes, { prefix: '/api/v1' })
  app.register(vinculoRoutes, { prefix: '/api/v1' })
}
