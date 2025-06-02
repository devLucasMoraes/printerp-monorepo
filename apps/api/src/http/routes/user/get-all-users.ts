import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { getAllUserUseCase } from '@/domain/useCases/user/GetAllUserUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getAllUsers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/users',
      {
        schema: {
          tags: ['users'],
          summary: 'Get all users',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
                role: z.nativeEnum(Role),
              }),
            ),
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

        const users = await getAllUserUseCase.execute(membership)

        const usersWithRole = users.map(({ memberOn, ...user }) => {
          return {
            ...user,
            role: memberOn[0].role,
          }
        })

        console.log(usersWithRole)

        return res.status(200).send(usersWithRole)
      },
    )
}
