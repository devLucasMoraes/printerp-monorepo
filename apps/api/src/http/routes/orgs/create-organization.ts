import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { repository } from '@/domain/repositories'
import { auth } from '@/http/middleware/auth'
import { createSlug } from '@/utils/create-slug'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/api/v1/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'create new organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
              slug: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const userId = await req.getCurrentUserId()

        const { name } = req.body

        const organizationData = repository.organization.create({
          name,
          slug: createSlug(name),
          ownerId: userId,
          owner: { id: userId },
          createdBy: userId,
          updatedBy: userId,
        })

        const organization =
          await repository.organization.save(organizationData)

        const memberData = repository.member.create({
          user: { id: userId },
          role: Role.ADMIN,
          organization,
        })

        await repository.member.save(memberData)

        return res
          .status(201)
          .send({ organizationId: organization.id, slug: organization.slug })
      },
    )
}
