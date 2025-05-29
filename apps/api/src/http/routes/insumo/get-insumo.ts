import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { getInsumoUseCase } from '@/domain/useCases/insumo/GetInsumoUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getInsumo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/insumos/:insumoId',
      {
        schema: {
          tags: ['insumos'],
          summary: '',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            insumoId: z.string(),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
              descricao: z.string(),
              valorUntMed: z.coerce.number(),
              valorUntMedAuto: z.boolean(),
              permiteEstoqueNegativo: z.boolean(),
              undEstoque: z.nativeEnum(Unidade),
              estoqueMinimo: z.coerce.number(),
              createdAt: z.date(),
              updatedAt: z.date(),
              deletedAt: z.date().nullable(),
              deletedBy: z.string().uuid().nullable(),
              createdBy: z.string().uuid(),
              updatedBy: z.string().uuid(),
              organizationId: z.string().uuid(),
              categoria: z.object({
                id: z.string().uuid(),
                nome: z.string(),
              }),
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

        if (cannot('get', 'Insumo')) {
          throw new UnauthorizedError(
            'You do not have permission to create a category',
          )
        }

        const { insumoId } = req.params

        const insumo = await getInsumoUseCase.execute(insumoId)

        return res.status(201).send(insumo)
      },
    )
}
