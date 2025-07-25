import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { updateNfeCompraUseCase } from '@/domain/useCases/nfe-compra/UpdateNfeCompraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nfe: z.string(),
  chaveNfe: z.string(),
  dataEmissao: z.string(),
  dataRecebimento: z.string(),
  valorTotalProdutos: z.number().nonnegative(),
  valorFrete: z.number().nonnegative(),
  valorTotalIpi: z.number().nonnegative(),
  valorSeguro: z.number().nonnegative(),
  valorDesconto: z.number().nonnegative(),
  valorTotalNfe: z.number().nonnegative(),
  valorOutros: z.number().nonnegative(),
  observacao: z.string().nullable(),
  addEstoque: z.boolean(),
  fornecedoraId: z.string().uuid(),
  transportadoraId: z.string().uuid(),
  armazemId: z.string().uuid().nullable(),
  itens: z.array(
    z.object({
      id: z.string().uuid().nullable(),
      qtdeNf: z.number().nonnegative(),
      unidadeNf: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      valorIpi: z.number().nonnegative(),
      descricaoFornecedora: z.string(),
      codFornecedora: z.string(),
      vinculoId: z.string().uuid(),
    }),
  ),
})

export type UpdateNfeCompraDTO = z.infer<typeof bodySchema>

export async function updateNfeCompra(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/nfes-compra/:nfeCompraId',
      {
        schema: {
          tags: ['nfes-compra'],
          summary: 'altera uma nfe-compra',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            nfeCompraId: z.string(),
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

        if (cannot('update', 'NfeCompra')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const nfeCompraDTO = req.body

        const { nfeCompraId } = req.params

        await updateNfeCompraUseCase.execute(
          nfeCompraId,
          nfeCompraDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateNfeCompraCache', {
          operation: 'update',
          orgSlug,
          nfeCompraId,
        })

        return res.status(204).send()
      },
    )
}
