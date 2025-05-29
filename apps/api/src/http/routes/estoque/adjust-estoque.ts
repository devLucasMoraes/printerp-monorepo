import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { adjustEstoqueUseCase } from '@/domain/useCases/estoque/AdjustEstoqueUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  quantidade: z.number(),
})

export type AdjustEstoqueDTO = z.infer<typeof bodySchema>

export async function adjustEstoque(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/api/v1/organizations/:orgSlug/estoques/adjust/:estoqueId',
      {
        schema: {
          tags: ['estoques'],
          summary: 'altera uma estoque',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            estoqueId: z.string(),
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

        if (cannot('adjust', 'Estoque')) {
          throw new UnauthorizedError(
            'Usuário não tem permissão para alterar estoque',
          )
        }

        const { quantidade } = req.body
        const { estoqueId } = req.params

        await adjustEstoqueUseCase.execute(
          estoqueId,
          { quantidade },
          membership,
        )

        return res.status(204).send()
      },
    )
}
