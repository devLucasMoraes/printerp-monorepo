import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { updateInsumoUseCase } from '@/domain/useCases/insumo/UpdateInsumoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  descricao: z.string().nonempty(),
  undEstoque: z.nativeEnum(Unidade),
  categoriaId: z.string().uuid(),
  valorUntMed: z.number().optional(),
  valorUntMedAuto: z.boolean().optional(),
  permiteEstoqueNegativo: z.boolean().optional(),
  estoqueMinimo: z.number().optional(),
})

export type UpdateInsumoDTO = z.infer<typeof bodySchema>

export async function updateInsumo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/insumos/:insumoId',
      {
        schema: {
          tags: ['insumos'],
          summary: 'altera uma insumo',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            orgSlug: z.string(),
            insumoId: z.string(),
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

        if (cannot('update', 'Insumo')) {
          throw new ForbiddenError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const {
          descricao,
          categoriaId,
          undEstoque,
          valorUntMed,
          valorUntMedAuto,
          permiteEstoqueNegativo,
          estoqueMinimo,
        } = req.body

        const { insumoId } = req.params

        await updateInsumoUseCase.execute(
          insumoId,
          {
            descricao,
            categoriaId,
            undEstoque,
            valorUntMed,
            valorUntMedAuto,
            permiteEstoqueNegativo,
            estoqueMinimo,
          },
          membership,
        )

        app.io.in(orgSlug).emit('invalidateInsumoCache', {
          operation: 'update',
          orgSlug,
          insumoId,
        })

        return res.status(204).send()
      },
    )
}
