import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getUserUseCase } from '@/domain/useCases/user/GetUserUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/users/:userId',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Get a category by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            userId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              name: z.string(),
              email: z.string().email(),
              avatarUrl: z.string().url().nullable(),
            }),
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

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        const { userId } = req.params

        const user = await getUserUseCase.execute(userId)

        return res.status(201).send(user)
      },
    )
}
