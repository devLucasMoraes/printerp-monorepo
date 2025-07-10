import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteEmprestimoUseCase } from '@/domain/useCases/emprestimo/DeleteEmprestimoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteEmprestimo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/organizations/:orgSlug/emprestimos/:emprestimoId',
      {
        schema: {
          tags: ['emprestimos'],
          summary: 'Delete a emprestimo by ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            emprestimoId: z.string(),
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

        if (cannot('delete', 'Emprestimo')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { emprestimoId } = req.params

        await deleteEmprestimoUseCase.execute(emprestimoId, membership)

        app.io.in(orgSlug).emit('invalidateEmprestimoCache', {
          operation: 'delete',
          orgSlug,
          emprestimoId,
        })

        return res.status(204).send()
      },
    )
}
