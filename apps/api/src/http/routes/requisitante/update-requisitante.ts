import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateRequisitanteUseCase } from '@/domain/useCases/requisitante/UpdateRequisitanteUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type UpdateRequisitanteDTO = z.infer<typeof bodySchema>

export async function updateRequisitante(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/requisitantes/:requisitanteId',
      {
        schema: {
          tags: ['requisitantes'],
          summary: 'altera uma requisitante',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'Requisitante')) {
          throw new UnauthorizedError(
            'Você não tem permissão para alterar um requisitante',
          )
        }

        const { nome, fone } = req.body
        const { requisitanteId } = req.params

        await updateRequisitanteUseCase.execute(
          requisitanteId,
          { nome, fone },
          membership,
        )

        app.io.in(orgSlug).emit('invalidateRequisitanteCache', {
          operation: 'update',
          orgSlug,
          requisitanteId,
        })

        return res.status(204).send()
      },
    )
}
