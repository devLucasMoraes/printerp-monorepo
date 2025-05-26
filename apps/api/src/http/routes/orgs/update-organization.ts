import { organizationSchema } from '@printerp/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { Not } from 'typeorm'
import { z } from 'zod'

import { repository } from '@/domain/repositories'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../../_errors/bad-request-error'
import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/api/v1/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'update organization by slug',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const userId = await req.getCurrentUserId()
        const { membership, organization } = await req.getUserMembership(slug)

        const { name, domain, shouldAttachUsersByDomain } = req.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to update this organization',
          )
        }

        if (domain) {
          const organizationByDomain = await repository.organization.findOne({
            where: {
              domain,
              id: Not(organization.id),
            },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Organization with this domain already exists',
            )
          }
        }

        await repository.organization.update(
          { id: organization.id },
          {
            name,
            domain,
            shouldAttachUsersByDomain: shouldAttachUsersByDomain ?? false,
          },
        )

        return res.status(204).send()
      },
    )
}
