import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateArmazemUseCase } from '@/domain/useCases/armazem/UpdateArmazemUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
})

export type UpdateArmazemDTO = z.infer<typeof bodySchema>

export async function updateArmazem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/api/v1/organizations/:orgSlug/armazens/:armazemId',
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
          throw new UnauthorizedError(
            'Você não tem permissão para alterar um armazem',
          )
        }

        const { nome } = req.body
        const { armazemId } = req.params

        await updateArmazemUseCase.execute(armazemId, { nome }, membership)

        return res.status(204).send()
      },
    )
}
