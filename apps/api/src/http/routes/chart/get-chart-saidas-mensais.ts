import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { chartSaidasMensaisUseCase } from '@/domain/useCases/charts/ChartSaidasMensaisUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getChartSaidasMensais(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/charts/saidas-mensais',
      {
        schema: {
          tags: ['chart'],
          summary: 'chart saidas mensais',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.object({
              total: z.number(),
              percentual: z.number(),
              seriesData: z.array(z.number()),
              xaxisData: z.array(z.string()),
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
          throw new ForbiddenError(
            'Você não tem permissão para acessar este recurso',
          )
        }

        const chart = await chartSaidasMensaisUseCase.execute(membership)

        return res.status(201).send(chart)
      },
    )
}
