import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteTransportadoraUseCase } from '@/domain/useCases/transportadora/DeleteTransportadoraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteTransportadora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/transportadoras/:transportadoraId',
      {
        schema: {
          tags: ['transportadoras'],
          summary: 'Delete a transportadora by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            transportadoraId: z.string(),
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

        if (cannot('delete', 'Transportadora')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { transportadoraId } = req.params

        await deleteTransportadoraUseCase.execute(transportadoraId, membership)

        app.io.in(orgSlug).emit('invalidateTransportadoraCache', {
          operation: 'delete',
          orgSlug,
          transportadoraId,
        })

        return res.status(204).send()
      },
    )
}
