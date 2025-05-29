import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateSetorUseCase } from '@/domain/useCases/setor/UpdateSetorUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nome: z.string(),
})

export type UpdateSetorDTO = z.infer<typeof bodySchema>

export async function updateSetor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/api/v1/organizations/:orgSlug/setores/:setorId',
      {
        schema: {
          tags: ['setores'],
          summary: 'altera uma setor',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            setorId: z.string(),
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

        if (cannot('update', 'Setor')) {
          throw new UnauthorizedError(
            'Você não tem permissão para alterar um setor',
          )
        }

        const { nome } = req.body
        const { setorId } = req.params

        await updateSetorUseCase.execute(setorId, { nome }, membership)

        return res.status(204).send()
      },
    )
}
