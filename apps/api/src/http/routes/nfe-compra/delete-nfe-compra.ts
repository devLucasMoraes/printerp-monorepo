import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteNfeCompraUseCase } from '@/domain/useCases/nfe-compra/DeleteNfeCompraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteNfeCompra(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/nfes-compra/:nfeCompraId',
      {
        schema: {
          tags: ['nfes-compra'],
          summary: 'Delete a nfeCompra by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            nfeCompraId: z.string(),
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

        if (cannot('delete', 'NfeCompra')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { nfeCompraId } = req.params

        await deleteNfeCompraUseCase.execute(nfeCompraId, membership)

        app.io.in(orgSlug).emit('invalidateNfeCompraCache', {
          operation: 'delete',
          orgSlug,
          nfeCompraId,
        })

        return res.status(204).send()
      },
    )
}
