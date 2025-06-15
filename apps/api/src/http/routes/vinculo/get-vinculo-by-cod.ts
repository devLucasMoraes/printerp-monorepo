// routes/vinculos/get-fornecedora-by-cnpj.ts
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { getVinculoByCodUseCase } from '@/domain/useCases/vinculo/GetVinculoByCodUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getVinculoByCod(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/vinculos/cod/:cod',
      {
        schema: {
          tags: ['vinculos'],
          summary: 'Get a vinculo by cod',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            cod: z.string(),
          }),
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

        if (cannot('get', 'Vinculo')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { cod } = req.params

        const vinculo = await getVinculoByCodUseCase.execute(cod, membership)

        return res.status(200).send(vinculo)
      },
    )
}
