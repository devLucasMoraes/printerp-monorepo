import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { updateTransportadoraUseCase } from '@/domain/useCases/transportadora/UpdateTransportadoraUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type UpdateTransportadoraDTO = z.infer<typeof bodySchema>

export async function updateTransportadora(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/api/v1/organizations/:orgSlug/transportadoras/:transportadoraId',
      {
        schema: {
          tags: ['transportadoras'],
          summary: 'altera uma transportadora',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            transportadoraId: z.string(),
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

        if (cannot('update', 'Transportadora')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar este recurso.',
          )
        }

        const updateTransportadoraDTO = req.body
        const { transportadoraId } = req.params

        await updateTransportadoraUseCase.execute(
          transportadoraId,
          updateTransportadoraDTO,
          membership,
        )

        return res.status(204).send()
      },
    )
}
