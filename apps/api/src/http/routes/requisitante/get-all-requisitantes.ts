import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllRequisitanteUseCase } from '@/domain/useCases/requisitante/GetAllRequisitanteUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getAllRequisitantes(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/requisitantes',
      {
        schema: {
          tags: ['requisitantes'],
          summary: 'Get all requisitantes',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.array(
              z.object({
                id: z.string().uuid(),
                nome: z.string(),
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

        if (cannot('get', 'Requisitante')) {
          throw new UnauthorizedError(
            'Você não tem permissão para listar requisitantes',
          )
        }

        const requisitantes =
          await getAllRequisitanteUseCase.execute(membership)

        return res.status(201).send(requisitantes)
      },
    )
}
