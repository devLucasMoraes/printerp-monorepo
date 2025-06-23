// routes/transportadoras/get-transportadora-by-cnpj.ts
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getTransportadoraByCnpjUseCase } from '@/domain/useCases/transportadora/GetTransportadoraByCnpjUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getTransportadoraByCnpj(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/transportadoras/cnpj/:cnpj',
      {
        schema: {
          tags: ['transportadoras'],
          summary: 'Get a transportadora by CNPJ',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            cnpj: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              nomeFantasia: z.string(),
              razaoSocial: z.string(),
              cnpj: z.string(),
              fone: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              deletedAt: z.date().nullable(),
              deletedBy: z.string().uuid().nullable(),
              createdBy: z.string().uuid(),
              updatedBy: z.string().uuid(),
              organizationId: z.string().uuid(),
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

        if (cannot('get', 'Transportadora')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { cnpj } = req.params

        const transportadora = await getTransportadoraByCnpjUseCase.execute(
          cnpj,
          membership,
        )

        return res.status(200).send(transportadora)
      },
    )
}
