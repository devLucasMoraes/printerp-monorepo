import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllTransportadorasUseCase } from '@/domain/useCases/transportadora/GetAllTransportadorasUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getAllTransportadoras(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/transportadoras',
      {
        schema: {
          tags: ['transportadoras'],
          summary: 'Get all transportadoras',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.array(
              z.object({
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
            ),
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
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const transportadoras =
          await getAllTransportadorasUseCase.execute(membership)

        return res.status(201).send(transportadoras)
      },
    )
}
