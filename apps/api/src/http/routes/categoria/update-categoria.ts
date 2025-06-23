import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateCategoriaUseCase } from '@/domain/useCases/categoria/UpdateCategoriaUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
})

export type UpdateCategoriaDTO = z.infer<typeof bodySchema>

export async function updateCategoria(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/categorias/:categoriaId',
      {
        schema: {
          tags: ['categorias'],
          summary: 'altera uma categoria',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'Categoria')) {
          throw new UnauthorizedError(
            'You do not have permission to update a category',
          )
        }

        const { nome } = req.body
        const { categoriaId } = req.params

        await updateCategoriaUseCase.execute(categoriaId, { nome }, membership)

        return res.status(204).send()
      },
    )
}
