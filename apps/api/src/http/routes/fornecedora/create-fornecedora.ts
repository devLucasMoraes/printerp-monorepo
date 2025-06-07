import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createFornecedoraUseCase } from '@/domain/useCases/fornecedora/CreateFornecedoraUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type CreateFornecedoraDTO = z.infer<typeof bodySchema>

export async function createFornecedora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/api/v1/organizations/:slug/fornecedoras',
      {
        schema: {
          tags: ['fornecedoras'],
          summary: 'cria um novo fornecedora',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              fornecedoraId: z.string(),
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

        if (cannot('create', 'Fornecedora')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const createFornecedoraDTO = req.body

        const fornecedora = await createFornecedoraUseCase.execute(
          createFornecedoraDTO,
          membership,
        )

        return res.status(201).send({ fornecedoraId: fornecedora.id })
      },
    )
}
