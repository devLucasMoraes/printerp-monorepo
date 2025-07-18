import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteFornecedoraUseCase } from '@/domain/useCases/fornecedora/DeleteFornecedoraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteFornecedora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/fornecedoras/:fornecedoraId',
      {
        schema: {
          tags: ['fornecedoras'],
          summary: 'Delete a fornecedora by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            fornecedoraId: z.string(),
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

        if (cannot('delete', 'Fornecedora')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { fornecedoraId } = req.params

        await deleteFornecedoraUseCase.execute(fornecedoraId, membership)

        app.io.in(orgSlug).emit('invalidateFornecedoraCache', {
          operation: 'delete',
          orgSlug,
          fornecedoraId,
        })

        return res.status(204).send()
      },
    )
}
