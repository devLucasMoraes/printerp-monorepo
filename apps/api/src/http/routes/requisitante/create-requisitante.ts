import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createRequisitanteUseCase } from '@/domain/useCases/requisitante/CreateRequisitanteUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type CreateRequisitanteDTO = z.infer<typeof bodySchema>

export async function createRequisitante(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/requisitantes',
      {
        schema: {
          tags: ['requisitantes'],
          summary: 'cria um novo requisitante',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              requisitanteId: z.string(),
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

        if (cannot('create', 'Requisitante')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { nome, fone } = req.body

        const requisitante = await createRequisitanteUseCase.execute(
          { nome, fone },
          membership,
        )

        app.io.in(slug).emit('invalidateRequisitanteCache', {
          operation: 'create',
          orgSlug: slug,
          requisitanteId: requisitante.id,
        })

        return res.status(201).send({ requisitanteId: requisitante.id })
      },
    )
}
