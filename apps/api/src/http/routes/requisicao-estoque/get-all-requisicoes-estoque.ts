import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { getAllRequisicaoEstoqueUseCase } from '@/domain/useCases/requisicao-estoque/GetAllRequisicaoEstoqueUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getAllRequisicoesEstoque(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/requisicoes-estoque',
      {
        schema: {
          tags: ['requisicoes-estoque'],
          summary: 'Get all requisicoes-estoque',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.array(
              z.object({
                id: z.string().uuid(),
                dataRequisicao: z.date(),
                valorTotal: z.coerce.number(),
                ordemProducao: z.string().nullable(),
                obs: z.string().nullable(),
                requisitante: z.object({
                  id: z.string().uuid(),
                  nome: z.string(),
                }),
                setor: z.object({
                  id: z.string().uuid(),
                  nome: z.string(),
                }),
                armazem: z.object({
                  id: z.string().uuid(),
                  nome: z.string(),
                }),
                itens: z.array(
                  z.object({
                    id: z.string().uuid(),
                    quantidade: z.coerce.number(),
                    unidade: z.nativeEnum(Unidade),
                    valorUnitario: z.coerce.number(),
                    insumo: z.object({
                      id: z.string().uuid(),
                      descricao: z.string(),
                      valorUntMed: z.coerce.number(),
                      undEstoque: z.nativeEnum(Unidade),
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

        if (cannot('get', 'RequisicaoEstoque')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar este recurso',
          )
        }

        const requisicoesEstoque =
          await getAllRequisicaoEstoqueUseCase.execute(membership)

        return res.status(201).send(requisicoesEstoque)
      },
    )
}
