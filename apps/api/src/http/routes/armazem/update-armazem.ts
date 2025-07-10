import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateArmazemUseCase } from '@/domain/useCases/armazem/UpdateArmazemUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
})

export type UpdateArmazemDTO = z.infer<typeof bodySchema>

export async function updateArmazem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/armazens/:armazemId',
      {
        schema: {
          tags: ['armazens'],
          summary: 'altera uma armazem',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'Armazem')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { nome } = req.body
        const { armazemId } = req.params

        await updateArmazemUseCase.execute(armazemId, { nome }, membership)

        app.io.in(orgSlug).emit('invalidateArmazemCache', {
          operation: 'update',
          orgSlug,
          armazemId,
        })

        return res.status(204).send()
      },
    )
}
