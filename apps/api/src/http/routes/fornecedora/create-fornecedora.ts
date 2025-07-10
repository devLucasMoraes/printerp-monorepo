import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createFornecedoraUseCase } from '@/domain/useCases/fornecedora/CreateFornecedoraUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

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
      '/organizations/:slug/fornecedoras',
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
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const createFornecedoraDTO = req.body

        const fornecedora = await createFornecedoraUseCase.execute(
          createFornecedoraDTO,
          membership,
        )

        app.io.in(slug).emit('invalidateFornecedoraCache', {
          operation: 'create',
          orgSlug: slug,
          fornecedoraId: fornecedora.id,
        })

        return res.status(201).send({ fornecedoraId: fornecedora.id })
      },
    )
}
