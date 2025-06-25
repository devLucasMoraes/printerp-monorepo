import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateParceiroUseCase } from '@/domain/useCases/parceiro/UpdateParceiroUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type UpdateParceiroDTO = z.infer<typeof bodySchema>

export async function updateParceiro(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/parceiros/:parceiroId',
      {
        schema: {
          tags: ['parceiros'],
          summary: 'altera um parceiro',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'Parceiro')) {
          throw new UnauthorizedError(
            'Você não tem permissão para alterar um parceiro',
          )
        }

        const { nome, fone } = req.body
        const { parceiroId } = req.params

        await updateParceiroUseCase.execute(
          parceiroId,
          { nome, fone },
          membership,
        )

        app.io.in(orgSlug).emit('invalidateParceiroCache', {
          operation: 'update',
          orgSlug,
          parceiroId,
        })

        return res.status(204).send()
      },
    )
}
