import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteRequisitanteUseCase } from '@/domain/useCases/requisitante/DeleteRequisitanteUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteRequisitante(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/requisitantes/:requisitanteId',
      {
        schema: {
          tags: ['requisitantes'],
          summary: 'Delete a requisitante by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            requisitanteId: z.string(),
          }),
          response: {
            204: z.null(),
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

        if (cannot('delete', 'Requisitante')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar um requisitante',
          )
        }

        const { requisitanteId } = req.params

        await deleteRequisitanteUseCase.execute(requisitanteId, membership)

        return res.status(204).send()
      },
    )
}
