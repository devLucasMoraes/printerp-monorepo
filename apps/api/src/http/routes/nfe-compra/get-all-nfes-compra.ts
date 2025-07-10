import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { getAllNfesCompraUseCase } from '@/domain/useCases/nfe-compra/GetAllNfesCompraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAllNfesCompra(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/nfes-compra',
      {
        schema: {
          tags: ['nfes-compra'],
          summary: 'Get all nfe-compra',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.array(
              z.object({
                id: z.string().uuid(),
                nfe: z.string(),
                chaveNfe: z.string(),
                dataEmissao: z.date(),
                dataRecebimento: z.date(),
                valorTotalProdutos: z.coerce.number(),
                valorFrete: z.coerce.number(),
                valorTotalIpi: z.coerce.number(),
                valorSeguro: z.coerce.number(),
                valorDesconto: z.coerce.number(),
                valorTotalNfe: z.coerce.number(),
                valorOutros: z.coerce.number(),
                observacao: z.string().nullable(),
                fornecedora: z.object({
                  id: z.string().uuid(),
                  nomeFantasia: z.string(),
                }),
                transportadora: z.object({
                  id: z.string().uuid(),
                  nomeFantasia: z.string(),
                }),
                armazem: z.object({
                  id: z.string().uuid(),
                  nome: z.string(),
                }),
                itens: z.array(
                  z.object({
                    id: z.string().uuid(),
                    qtdeNf: z.coerce.number(),
                    unidadeNf: z.nativeEnum(Unidade),
                    valorUnitario: z.coerce.number(),
                    valorIpi: z.coerce.number(),
                    descricaoFornecedora: z.string(),
                    codFornecedora: z.string(),
                    vinculo: z.object({
                      id: z.string().uuid(),
                      cod: z.string(),
                      undCompra: z.nativeEnum(Unidade),
                      possuiConversao: z.boolean(),
                      qtdeEmbalagem: z.coerce.number().nullable(),
                      insumoId: z.string().uuid(),
                      insumo: z.object({
                        id: z.string().uuid(),
                        descricao: z.string(),
                        valorUntMed: z.coerce.number(),
                        undEstoque: z.nativeEnum(Unidade),
                      }),
                      fornecedoraId: z.string().uuid(),
                    }),
                  }),
                ),
                createdAt: z.date(),
                updatedAt: z.date(),
                deletedAt: z.date().nullable(),
                deletedBy: z.string().uuid().nullable(),
                createdBy: z.string().uuid(),
                updatedBy: z.string().uuid(),
                organizationId: z.string().uuid(),
              }),
            ),
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

        if (cannot('get', 'NfeCompra')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar este recurso',
          )
        }

        const nfesCompra = await getAllNfesCompraUseCase.execute(membership)

        return res.status(201).send(nfesCompra)
      },
    )
}
