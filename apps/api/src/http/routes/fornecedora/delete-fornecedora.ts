import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteFornecedoraUseCase } from '@/domain/useCases/fornecedora/DeleteFornecedoraUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteFornecedora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/api/v1/organizations/:orgSlug/fornecedoras/:fornecedoraId',
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
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { fornecedoraId } = req.params

        await deleteFornecedoraUseCase.execute(fornecedoraId, membership)

        return res.status(204).send()
      },
    )
}
