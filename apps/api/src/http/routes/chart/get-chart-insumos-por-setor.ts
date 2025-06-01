import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { chartInsumosPorSetorUseCase } from '@/domain/useCases/charts/ChartInsumosPorSetorUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getChartInsumosPorSetor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/charts/insumos-por-setor/:periodo',
      {
        schema: {
          tags: ['chart'],
          summary: 'chart insumos por setor',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            periodo: z.string(),
          }),
          response: {
            201: z.object({
              xaxisData: z.array(z.string()),
              series: z.array(
                z.object({
                  name: z.string(),
                  data: z.array(z.number()),
                }),
              ),
              totalGeral: z.number(),
            }),
          },
        },
      },
      async (req, res) => {
        const { orgSlug } = req.params

        const { membership } = await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('get', 'Chart')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar este recurso',
          )
        }

        const { periodo } = req.params

        const chart = await chartInsumosPorSetorUseCase.execute(
          membership,
          periodo,
        )

        return res.status(201).send(chart)
      },
    )
}
