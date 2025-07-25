import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { createNfeCompraUseCase } from '@/domain/useCases/nfe-compra/CreateNfeCompraUseCase'
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

export type CreateNfeCompraDTO = z.infer<typeof bodySchema>

export async function createNfeCompra(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/nfes-compra',
      {
        schema: {
          tags: ['nfes-compra'],
          summary: 'cria uma nova nfe-compra',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              nfeCompraId: z.string(),
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

        if (cannot('create', 'NfeCompra')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const nfeCompraDTO = req.body

        const nfeCompra = await createNfeCompraUseCase.execute(
          nfeCompraDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateNfeCompraCache', {
          operation: 'create',
          orgSlug: slug,
          nfeCompraId: nfeCompra.id,
        })

        return res.status(201).send({ nfeCompraId: nfeCompra.id })
      },
    )
}
