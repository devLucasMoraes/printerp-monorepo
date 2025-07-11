import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteParceiroUseCase } from '@/domain/useCases/parceiro/DeleteParceiroUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteParceiro(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/parceiros/:parceiroId',
      {
        schema: {
          tags: ['parceiros'],
          summary: 'Delete a parceiro by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            parceiroId: z.string(),
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

        if (cannot('delete', 'Parceiro')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { parceiroId } = req.params

        await deleteParceiroUseCase.execute(parceiroId, membership)

        app.io.in(orgSlug).emit('invalidateParceiroCache', {
          operation: 'delete',
          orgSlug,
          parceiroId,
        })

        return res.status(204).send()
      },
    )
}
