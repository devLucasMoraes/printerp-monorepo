import { userSchema } from '@printerp/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { createOrganizationalUserUseCase } from '@/domain/useCases/user/CreateOrganizationalUserUseCase'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
})

export type CreateUserDTO = z.infer<typeof bodySchema>

export async function createOrganizationalUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/api/v1/organizations/:slug/users',
      {
        schema: {
          tags: ['users'],
          summary: 'Create a new user',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            201: z.object({
              userId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const { membership, organization } = await req.getUserMembership(slug)

        const { name, email, password, role } = req.body

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        const authUser = userSchema.parse({
          ...membership.user,
          role,
          organizationOwnerId: organization.ownerId,
        })

        if (cannot('create', authUser)) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar um usuário',
          )
        }

        const user = await createOrganizationalUserUseCase.execute(
          {
            name,
            email,
            password,
            role,
          },
          membership,
        )

        return res.status(201).send({ userId: user.id })
      },
    )
}
