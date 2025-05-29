import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { listEmprestimoUseCase } from '@/domain/useCases/emprestimo/ListEmprestimoUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function listEmprestimos(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/emprestimos/list',
      {
        schema: {
          tags: ['emprestimos'],
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
                  dataEmprestimo: z.date(),
                  previsaoDevolucao: z.date().nullable(),
                  custoEstimado: z.coerce.number(),
                  tipo: z.string(),
                  status: z.string(),
                  obs: z.string().nullable(),
                  parceiro: z.object({
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
                      devolucaoItens: z.array(
                        z.object({
                          id: z.string().uuid(),
                          dataDevolucao: z.date(),
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

        if (cannot('get', 'Emprestimo')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listEmprestimoUseCase.execute(
          membership,
          pageRequest,
        )

        return res.status(201).send(result)
      },
    )
}
