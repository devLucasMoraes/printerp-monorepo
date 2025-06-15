import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { listNfeCompraUseCase } from '@/domain/useCases/nfe-compra/ListNfesCompraUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function listNfesCompra(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/nfes-compra/list',
      {
        schema: {
          tags: ['nfes-compra'],
          summary: '',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          querystring: z
            .object({
              page: z.coerce.number().optional(),
              size: z.coerce.number().optional(),
              sort: z.union([z.string(), z.array(z.string())]).optional(),
            })
            .optional(),
          response: {
            201: z.object({
              content: z.array(
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
              totalPages: z.number(),
              totalElements: z.number(),
              size: z.number(),
              number: z.number(),
              numberOfElements: z.number(),
              empty: z.boolean(),
            }),
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
          throw new UnauthorizedError(
            'Você não tem permissão para realizar esta ação.',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listNfeCompraUseCase.execute(
          membership,
          pageRequest,
        )

        return res.status(201).send(result)
      },
    )
}
