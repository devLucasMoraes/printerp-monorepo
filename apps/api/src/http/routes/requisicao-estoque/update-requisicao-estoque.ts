import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { updateRequisicaoEstoqueUseCase } from '@/domain/useCases/requisicao-estoque/UpdateRequisicaoEstoqueUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  dataRequisicao: z.string(),
  ordemProducao: z.string().nullable(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitanteId: z.string().uuid(),
  setorId: z.string().uuid(),
  armazemId: z.string().uuid(),
  itens: z.array(
    z.object({
      id: z.string().uuid().nullable(),
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string().uuid(),
    }),
  ),
})

export type UpdateRequisicaoEstoqueDTO = z.infer<typeof bodySchema>

export async function updateRequisicaoEstoque(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/requisicoes-estoque/:requisicaoEstoqueId',
      {
        schema: {
          tags: ['requisicoes-estoque'],
          summary: 'altera uma requisição de estoque',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'RequisicaoEstoque')) {
          throw new UnauthorizedError(
            'Você não tem permissão para alterar um requisição de Estoque',
          )
        }

        const requisicaoEstoqueDTO = req.body

        const { requisicaoEstoqueId } = req.params

        await updateRequisicaoEstoqueUseCase.execute(
          requisicaoEstoqueId,
          requisicaoEstoqueDTO,
          membership,
        )

        return res.status(204).send()
      },
    )
}
