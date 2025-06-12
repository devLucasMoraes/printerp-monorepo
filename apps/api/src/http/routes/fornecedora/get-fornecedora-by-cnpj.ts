// routes/fornecedoras/get-fornecedora-by-cnpj.ts
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getFornecedoraByCnpjUseCase } from '@/domain/useCases/fornecedora/GetFornecedoraByCnpjUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

export async function getFornecedoraByCnpj(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/api/v1/organizations/:orgSlug/fornecedoras/cnpj/:cnpj',
      {
        schema: {
          tags: ['fornecedoras'],
          summary: 'Get a fornecedora by CNPJ',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            cnpj: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              nomeFantasia: z.string(),
              razaoSocial: z.string(),
              cnpj: z.string(),
              fone: z.string(),
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

        if (cannot('get', 'Fornecedora')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const { cnpj } = req.params

        const fornecedora = await getFornecedoraByCnpjUseCase.execute(
          cnpj,
          membership,
        )

        return res.status(200).send(fornecedora)
      },
    )
}
