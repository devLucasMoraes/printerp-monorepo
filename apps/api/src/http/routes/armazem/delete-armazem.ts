import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteArmazemUseCase } from '@/domain/useCases/armazem/DeleteArmazemUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteArmazem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/armazens/:armazemId',
      {
        schema: {
          tags: ['armazens'],
          summary: 'Delete a armazem by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            armazemId: z.string(),
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

        if (cannot('delete', 'Armazem')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar um armazem',
          )
        }

        const { armazemId } = req.params

        await deleteArmazemUseCase.execute(armazemId, membership)

        app.io.in(orgSlug).emit('invalidateArmazemCache', {
          operation: 'delete',
          orgSlug,
          armazemId,
        })

        return res.status(204).send()
      },
    )
}
