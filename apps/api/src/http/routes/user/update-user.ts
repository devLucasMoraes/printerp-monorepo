import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { updateUserUseCase } from '@/domain/useCases/user/UpdateUserUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().nullable(),
  role: z.nativeEnum(Role),
})

export type UpdateUserDTO = z.infer<typeof bodySchema>

export async function updateUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/api/v1/organizations/:orgSlug/users/:userId',
      {
        schema: {
          tags: ['users'],
          summary: 'altera uma usuario',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            userId: z.string(),
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

        if (cannot('update', 'User')) {
          throw new UnauthorizedError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const updateCategoriaDTO = req.body
        const { userId } = req.params

        await updateUserUseCase.execute(userId, updateCategoriaDTO, membership)

        return res.status(204).send()
      },
    )
}
