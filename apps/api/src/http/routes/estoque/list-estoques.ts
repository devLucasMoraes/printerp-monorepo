import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { listEstoqueUseCase } from '@/domain/useCases/estoque/ListEstoqueUseCase'
import { auth } from '@/http/middleware/auth'
import {
  calcularDiasRestantes,
  calcularPrevisaoEstoqueMinimo,
  calcularPrevisaoFimEstoque,
} from '@/utils/estoque-calculations'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function listEstoques(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/estoques/list',
      {
        schema: {
          tags: ['estoques'],
          summary: 'List estoques',
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
                  quantidade: z.coerce.number(),
                  consumoMedioDiario: z.coerce.number().nullable(),
                  ultimaAtualizacaoConsumo: z.date().nullable(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  deletedAt: z.date().nullable(),
                  deletedBy: z.string().uuid().nullable(),
                  createdBy: z.string().uuid(),
                  updatedBy: z.string().uuid(),
                  organizationId: z.string().uuid(),
                  armazem: z.object({
                    id: z.string().uuid(),
                    nome: z.string(),
                  }),
                  insumo: z.object({
                    id: z.string().uuid(),
                    descricao: z.string(),
                    undEstoque: z.nativeEnum(Unidade),
                    categoria: z.object({
                      id: z.string().uuid(),
                      nome: z.string(),
                    }),
                    abaixoMinimo: z.boolean(),
                  }),
                  abaixoMinimo: z.boolean(),
                  diasRestantes: z.number().nullable(),
                  previsaoFimEstoque: z.date().nullable(),
                  previsaoEstoqueMinimo: z.date().nullable(),
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

        if (cannot('get', 'Estoque')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar este recurso.',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listEstoqueUseCase.execute(membership, pageRequest)

        const estoquesComCalculos = {
          ...result,
          content: result.content.map((estoque) => ({
            ...estoque,
            diasRestantes: calcularDiasRestantes(
              estoque.quantidade,
              estoque.consumoMedioDiario,
            ),
            previsaoFimEstoque: calcularPrevisaoFimEstoque(
              estoque.quantidade,
              estoque.consumoMedioDiario,
            ),
            previsaoEstoqueMinimo: calcularPrevisaoEstoqueMinimo(
              estoque.quantidade,
              estoque.consumoMedioDiario,
              estoque.insumo.estoqueMinimo,
            ),
          })),
        }

        return res.status(201).send(estoquesComCalculos)
      },
    )
}
