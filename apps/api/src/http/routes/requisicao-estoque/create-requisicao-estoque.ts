import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { createRequisicaoEstoqueUseCase } from '@/domain/useCases/requisicao-estoque/CreateRequisicaoEstoqueUseCase'
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
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string().uuid(),
    }),
  ),
})

export type CreateRequisicaoEstoqueDTO = z.infer<typeof bodySchema>

export async function createRequisicaoEstoque(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/requisicoes-estoque',
      {
        schema: {
          tags: ['requisicoes-estoque'],
          summary: 'cria uma nova requisicao de estoque',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              requisicaoEstoqueId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params

        const { membership } = await req.getUserMembership(slug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'RequisicaoEstoque')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar uma nova requisição de estoque',
          )
        }

        const requisicaoEstoqueDTO = req.body

        const requisicaoEstoque = await createRequisicaoEstoqueUseCase.execute(
          requisicaoEstoqueDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateRequisicaoEstoqueCache', {
          operation: 'create',
          orgSlug: slug,
          requisicaoEstoqueId: requisicaoEstoque.id,
        })

        return res
          .status(201)
          .send({ requisicaoEstoqueId: requisicaoEstoque.id })
      },
    )
}
