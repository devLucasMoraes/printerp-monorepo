import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createParceiroUseCase } from '@/domain/useCases/parceiro/CreateParceiroUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type CreateParceiroDTO = z.infer<typeof bodySchema>

export async function createParceiro(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/api/v1/organizations/:slug/parceiros',
      {
        schema: {
          tags: ['parceiros'],
          summary: 'cria um novo parceiro',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              parceiroId: z.string(),
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

        if (cannot('create', 'Parceiro')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar um parceiro',
          )
        }

        const { nome, fone } = req.body

        const parceiro = await createParceiroUseCase.execute(
          { nome, fone },
          membership,
        )

        return res.status(201).send({ parceiroId: parceiro.id })
      },
    )
}
