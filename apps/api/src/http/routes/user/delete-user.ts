import { userSchema } from '@printerp/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteUserUseCase } from '@/domain/useCases/user/DeleteUserUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/users/:userId',
      {
        schema: {
          tags: ['users'],
          summary: 'Delete a user by ID',
          security: [{ bearerAuth: [] }],
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
        const { orgSlug, userId } = req.params

        const { membership, organization } =
          await req.getUserMembership(orgSlug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        const user = userSchema.parse({
          id: userId,
          role: membership.role,
          organizationOwnerId: organization.ownerId,
        })

        if (cannot('delete', user)) {
          throw new UnauthorizedError(
            'Você não tem permissão para realizar essa ação',
          )
        }

        await deleteUserUseCase.execute(userId, membership)

        return res.status(204).send()
      },
    )
}
