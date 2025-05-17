import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAllCategoriaUseCase } from '@/domain/useCases/categoria/GetAllCategoriaUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getAllCategorias(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/categorias',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Get all categories',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            201: z.array(
              z.object({
                id: z.string().uuid(),
                nome: z.string(),
                ativo: z.boolean(),
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

        if (cannot('get', 'Categoria')) {
          throw new UnauthorizedError(
            'You do not have permission to create a category',
          )
        }

        const categorias = await getAllCategoriaUseCase.execute(membership)

        return res.status(201).send(categorias)
      },
    )
}
