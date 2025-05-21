import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteRequisicaoEstoqueUseCase } from '@/domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteRequisicaoEstoque(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/requisicoes-estoque/:requisicaoEstoqueId',
      {
        schema: {
          tags: ['requisicoes-estoque'],
          summary: 'Delete a requisicoesEstoque by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            requisicaoEstoqueId: z.string(),
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

        if (cannot('delete', 'RequisicaoEstoque')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar requisições de estoque',
          )
        }

        const { requisicaoEstoqueId } = req.params

        await deleteRequisicaoEstoqueUseCase.execute(
          requisicaoEstoqueId,
          membership,
        )

        return res.status(204).send()
      },
    )
}
