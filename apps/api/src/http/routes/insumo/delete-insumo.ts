import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteInsumoUseCase } from '@/domain/useCases/insumo/DeleteInsumoUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteInsumo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/insumos/:insumoId',
      {
        schema: {
          tags: ['insumos'],
          summary: 'Delete a insumo by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            insumoId: z.string(),
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

        if (cannot('delete', 'Insumo')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar insumos',
          )
        }

        const { insumoId } = req.params

        await deleteInsumoUseCase.execute(insumoId, membership)

        return res.status(204).send()
      },
    )
}
