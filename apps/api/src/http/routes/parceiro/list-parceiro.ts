import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { listParceiroUseCase } from '@/domain/useCases/parceiro/ListParceiroUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function listParceiros(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/parceiros/list',
      {
        schema: {
          tags: ['parceiros'],
          summary: 'List parceiros',
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
                  nome: z.string(),
                  fone: z.string(),
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

        if (cannot('get', 'Parceiro')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar este recurso.',
          )
        }

        const pageRequest = {
          page: req.query?.page,
          size: req.query?.size,
          sort: req.query?.sort,
        }

        const result = await listParceiroUseCase.execute(
          membership,
          pageRequest,
        )

        return res.status(201).send(result)
      },
    )
}
