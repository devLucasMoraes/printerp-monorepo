import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createArmazemUseCase } from '@/domain/useCases/armazem/CreateArmazemUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
})

export type CreateArmazemDTO = z.infer<typeof bodySchema>

export async function createArmazem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/armazens',
      {
        schema: {
          tags: ['armazens'],
          summary: 'cria um novo armazem',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              armazemId: z.string(),
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

        if (cannot('create', 'Armazem')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { nome } = req.body

        const armazem = await createArmazemUseCase.execute({ nome }, membership)

        app.io.in(slug).emit('invalidateArmazemCache', {
          operation: 'create',
          orgSlug: slug,
          armazemId: armazem.id,
        })

        return res.status(201).send({ armazemId: armazem.id })
      },
    )
}
