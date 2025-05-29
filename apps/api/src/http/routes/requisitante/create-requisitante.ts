import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createRequisitanteUseCase } from '@/domain/useCases/requisitante/CreateRequisitanteUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

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
      '/api/v1/organizations/:slug/requisitantes',
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
          throw new UnauthorizedError(
            'Você não tem permissão para criar um requisitante',
          )
        }

        const { nome, fone } = req.body

        const requisitante = await createRequisitanteUseCase.execute(
          { nome, fone },
          membership,
        )

        return res.status(201).send({ requisitanteId: requisitante.id })
      },
    )
}
