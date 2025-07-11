import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createTransportadoraUseCase } from '@/domain/useCases/transportadora/CreateTransportadoraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type CreateTransportadoraDTO = z.infer<typeof bodySchema>

export async function createTransportadora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/transportadoras',
      {
        schema: {
          tags: ['transportadoras'],
          summary: 'cria uma nova transportadora',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              transportadoraId: z.string(),
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

        if (cannot('create', 'Transportadora')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const createTransportadoraDTO = req.body

        const transportadora = await createTransportadoraUseCase.execute(
          createTransportadoraDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateTransportadoraCache', {
          operation: 'create',
          orgSlug: slug,
          transportadoraId: transportadora.id,
        })

        return res.status(201).send({ transportadoraId: transportadora.id })
      },
    )
}
