import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteSetorUseCase } from '@/domain/useCases/setor/DeleteSetorUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function deleteSetor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/api/v1/organizations/:orgSlug/setores/:setorId',
      {
        schema: {
          tags: ['setores'],
          summary: 'Delete a setor by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            setorId: z.string(),
          }),
          response: {
            204: z.null(),
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

        if (cannot('delete', 'Setor')) {
          throw new UnauthorizedError(
            'You do not have permission to delete a category',
          )
        }

        const { setorId } = req.params

        await deleteSetorUseCase.execute(setorId, membership)

        return res.status(204).send()
      },
    )
}
