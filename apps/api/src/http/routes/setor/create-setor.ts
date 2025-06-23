import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { createSetorUseCase } from '@/domain/useCases/setor/CreateSetorUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
})

export type CreateSetorDTO = z.infer<typeof bodySchema>

export async function createSetor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/setores',
      {
        schema: {
          tags: ['setores'],
          summary: 'cria um novo setor',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              setorId: z.string(),
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

        if (cannot('create', 'Setor')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar um setor',
          )
        }

        const { nome } = req.body

        const setor = await createSetorUseCase.execute({ nome }, membership)

        app.io.in(slug).emit('invalidateSetorCache', {
          operation: 'create',
          orgSlug: slug,
          setorId: setor.id,
        })

        return res.status(201).send({ setorId: setor.id })
      },
    )
}
