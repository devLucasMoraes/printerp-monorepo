import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { createInsumoUseCase } from '@/domain/useCases/insumo/CreateInsumoUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  descricao: z.string(),
  undEstoque: z.nativeEnum(Unidade),
  categoriaId: z.string(),
  valorUntMed: z.number().optional(),
  valorUntMedAuto: z.boolean().optional(),
  permiteEstoqueNegativo: z.boolean().optional(),
  estoqueMinimo: z.number().optional(),
})

export type CreateInsumoDTO = z.infer<typeof bodySchema>

export async function createInsumo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/api/v1/organizations/:slug/insumos',
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
          throw new UnauthorizedError(
            'Você não tem permissão para criar insumos',
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

        return res.status(201).send({ insumoId: insumo.id })
      },
    )
}
