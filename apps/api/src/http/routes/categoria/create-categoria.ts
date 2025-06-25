import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createCategoriaUseCase } from '@/domain/useCases/categoria/CreateCategoriaUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
})

export type CreateCategoriaDTO = z.infer<typeof bodySchema>

export async function createCategoria(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/categorias',
      {
        schema: {
          tags: ['categorias'],
          summary: 'cria uma nova categoria',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              categoriaId: z.string(),
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

        if (cannot('create', 'Categoria')) {
          throw new UnauthorizedError(
            'You do not have permission to create a category',
          )
        }

        const { nome } = req.body

        const categoria = await createCategoriaUseCase.execute(
          { nome },
          membership,
        )

        app.io.in(slug).emit('invalidateCategoriaCache', {
          operation: 'create',
          orgSlug: slug,
          categoriaId: categoria.id,
        })

        return res.status(201).send({ categoriaId: categoria.id })
      },
    )
}
