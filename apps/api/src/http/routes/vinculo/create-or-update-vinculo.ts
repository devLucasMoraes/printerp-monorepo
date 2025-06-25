import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { createOrUpdateVinculoUseCase } from '@/domain/useCases/vinculo/CreateOrUpdateVinculoUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { normalizeText } from '@/utils/normalizeText'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  cod: z.string().transform((value) => normalizeText(value)),
  undCompra: z.nativeEnum(Unidade),
  possuiConversao: z.boolean(),
  qtdeEmbalagem: z.number().nullable(),
  fornecedoraId: z.string().uuid(),
  insumoId: z.string().uuid(),
})

export type CreateOrUpdateVinculoDto = z.infer<typeof bodySchema>

export async function createOrUpdateVinculo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:orgSlug/vinculos',
      {
        schema: {
          tags: ['vinculos'],
          summary: 'Create or update vinculo',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          body: bodySchema,
          response: {
            200: z.object({
              id: z.string().uuid(),
              cod: z.string(),
              undCompra: z.nativeEnum(Unidade),
              possuiConversao: z.boolean(),
              qtdeEmbalagem: z.number().nullable(),
              fornecedoraId: z.string().uuid(),
              insumo: z.object({
                id: z.string().uuid(),
                descricao: z.string().nullable(),
                undEstoque: z.nativeEnum(Unidade),
              }),
              createdAt: z.date(),
              updatedAt: z.date(),
              deletedAt: z.date().nullable(),
              deletedBy: z.string().uuid().nullable(),
              createdBy: z.string().uuid(),
              updatedBy: z.string().uuid(),
              organizationId: z.string().uuid(),
            }),
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

        if (cannot('create', 'Vinculo')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const dto = req.body

        const vinculo = await createOrUpdateVinculoUseCase.execute(
          dto,
          membership,
        )

        console.log({ vinculo })

        app.io.in(orgSlug).emit('invalidateVinculoCache', {
          operation: 'create',
          orgSlug,
          vinculoId: vinculo.id,
        })

        return res.status(200).send(vinculo)
      },
    )
}
