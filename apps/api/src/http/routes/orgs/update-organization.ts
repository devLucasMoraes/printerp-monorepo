import { organizationSchema } from '@printerp/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateOrganizationUseCase } from '@/domain/useCases/organization/UpdateOrganizationUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  name: z.string(),
})

export type UpdateOrganizationDto = z.infer<typeof bodySchema>

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'update organization by slug',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: bodySchema,
          response: {
            204: z.null(),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params
        const userId = await req.getCurrentUserId()
        const { membership, organization } = await req.getUserMembership(slug)

        const { name } = req.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to update this organization',
          )
        }

        await updateOrganizationUseCase.execute(
          organization.id,
          { name },
          membership,
        )

        app.io.in(organization.slug).emit('invalidateOrganizationCache', {
          operation: 'update',
          orgSlug: organization.slug,
          organizationId: organization.id,
        })

        return res.status(204).send()
      },
    )
}
