import { FastifyInstance } from 'fastify'

import { getChartInsumosPorSetor } from './get-chart-insumos-por-setor'
import { getChartSaidasMensais } from './get-chart-saidas-mensais'

export default async function (app: FastifyInstance) {
  app.register(getChartInsumosPorSetor)
  app.register(getChartSaidasMensais)
}
