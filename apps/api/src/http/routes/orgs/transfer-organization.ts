import { organizationSchema } from '@printerp/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Member } from '@/domain/entities/Member'
import { Role } from '@/domain/entities/Role'
import { repository } from '@/domain/repositories'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Transfer ownership of an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.string().uuid(),
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

        const { transferToUserId } = req.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to transfer ownership of this organization',
          )
        }

        const transferToMember = await repository.member.findOne({
          where: {
            organizationId: organization.id,
            userId: transferToUserId,
          },
        })

        if (!transferToMember) {
          throw new BadRequestError(
            'The user you are trying to transfer ownership to is not a member of this organization',
          )
        }

        await repository.member.manager.transaction(async (manager) => {
          await manager.update(
            Member,
            {
              organizationId: organization.id,
              userId: transferToUserId,
            },
            { role: Role.ADMIN },
          )
        })

        return res.status(204).send()
      },
    )
}
