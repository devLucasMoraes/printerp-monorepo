import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Role } from '@/domain/entities/Role'
import { repository } from '@/domain/repositories'
import { auth } from '@/http/middleware/auth'
import { createSlug } from '@/utils/create-slug'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'create new organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const userId = await req.getCurrentUserId()

        const { name, domain, shouldAttachUsersByDomain } = req.body

        if (domain) {
          const organizationByDomain = await repository.organization.findOne({
            where: {
              domain,
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Organization with this domain already exists',
            )
          }
        }

        const memberData = repository.member.create({
          userId,
          role: Role.ADMIN,
        })

        const organizationData = repository.organization.create({
          name,
          slug: createSlug(name),
          domain,
          shouldAttachUsersByDomain: shouldAttachUsersByDomain ?? false,
          active: true,
          members: [memberData],
        })

        const organization =
          await repository.organization.save(organizationData)

        return res.status(201).send({ organizationId: organization.id })
      },
    )
}
