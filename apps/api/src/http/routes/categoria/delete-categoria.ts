import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteCategoriaUseCase } from '@/domain/useCases/categoria/DeleteCategoriaUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteCategoria(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/categorias/:categoriaId',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Delete a category by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            categoriaId: z.string(),
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

        if (cannot('delete', 'Categoria')) {
          throw new UnauthorizedError(
            'You do not have permission to delete a category',
          )
        }

        const { categoriaId } = req.params

        await deleteCategoriaUseCase.execute(categoriaId, membership)

        return res.status(204).send()
      },
    )
}
