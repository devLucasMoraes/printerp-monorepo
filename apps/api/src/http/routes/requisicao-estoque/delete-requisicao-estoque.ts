import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteRequisicaoEstoqueUseCase } from '@/domain/useCases/requisicao-estoque/DeleteRequisicaoEstoqueUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

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
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { requisicaoEstoqueId } = req.params

        await deleteRequisicaoEstoqueUseCase.execute(
          requisicaoEstoqueId,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateRequisicaoEstoqueCache', {
          operation: 'delete',
          orgSlug,
          requisicaoEstoqueId,
        })

        return res.status(204).send()
      },
    )
}
