import { roleSchema } from '@printerp/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'
import { auth } from '@/http/middleware/auth'

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'get organizations where user is member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (req, res) => {
        const userId = await req.getCurrentUserId()

        const organizations = await repository.organization.find({
          where: {
            members: {
              userId, // Filtra organizações que tenham membros com o userId
            },
          },
          relations: { members: true }, // Carrega a relação members
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              // Seleciona apenas o campo "role" dos membros
              role: true,
            },
          },
        })

        const organizationsWithRole = organizations.map(
          ({ members, ...org }) => {
            return {
              ...org,
              role: members[0].role,
            }
          },
        )

        return res.status(200).send({ organizations: organizationsWithRole })
      },
    )
}
