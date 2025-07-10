import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { createInsumoUseCase } from '@/domain/useCases/insumo/CreateInsumoUseCase'
import { ForbiddenError } from '@/http/_errors/Forbidden-error'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

const bodySchema = z.object({
  descricao: z.string().nonempty(),
  undEstoque: z.nativeEnum(Unidade),
  valorUntMed: z.number().optional(),
  valorUntMedAuto: z.boolean().optional(),
  permiteEstoqueNegativo: z.boolean().optional(),
  estoqueMinimo: z.number().optional(),
  categoriaId: z.string().uuid(),
})

export type CreateInsumoDTO = z.infer<typeof bodySchema>

export async function createInsumo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/insumos',
      {
        schema: {
          tags: ['insumos'],
          summary: 'cria um novo insumo',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              insumoId: z.string(),
            }),
          },
        },
      },
      async (req, res) => {
        const { slug } = req.params

        const { membership } = await req.getUserMembership(slug)

        const { cannot } = getUserPermissions(
          membership.user.id,
          membership.role,
        )

        if (cannot('create', 'Insumo')) {
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

        const insumo = await createInsumoUseCase.execute(
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

        app.io.in(slug).emit('invalidateInsumoCache', {
          operation: 'create',
          orgSlug: slug,
          insumoId: insumo.id,
        })

        return res.status(201).send({ insumoId: insumo.id })
      },
    )
}
