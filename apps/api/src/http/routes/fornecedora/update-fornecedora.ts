import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateFornecedoraUseCase } from '@/domain/useCases/fornecedora/UpdateFornecedoraUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type UpdateFornecedoraDTO = z.infer<typeof bodySchema>

export async function updateFornecedora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/fornecedoras/:fornecedoraId',
      {
        schema: {
          tags: ['fornecedoras'],
          summary: 'altera uma fornecedora',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'Fornecedora')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar este recurso.',
          )
        }

        const updateFornecedoraDTO = req.body
        const { fornecedoraId } = req.params

        await updateFornecedoraUseCase.execute(
          fornecedoraId,
          updateFornecedoraDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateFornecedoraCache', {
          operation: 'update',
          orgSlug,
          fornecedoraId,
        })

        return res.status(204).send()
      },
    )
}
