import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { createEmprestimoUseCase } from '@/domain/useCases/emprestimo/CreateEmprestimoUseCase'
import { auth } from '@/http/middleware/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../../_errors/unauthorized-error'

const bodySchema = z.object({
  dataEmprestimo: z.string(),
  previsaoDevolucao: z.string().nullable(),
  custoEstimado: z.number().nonnegative(),
  tipo: z.enum(['ENTRADA', 'SAIDA']),
  status: z.enum(['EM_ABERTO', 'FECHADO']),
  obs: z.string().nullable(),
  parceiroId: z.string().uuid(),
  armazemId: z.string().uuid(),
  itens: z.array(
    z.object({
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string().uuid(),
    }),
  ),
})

export type CreateEmprestimoDTO = z.infer<typeof bodySchema>

export async function createEmprestimo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/api/v1/organizations/:slug/emprestimos',
      {
        schema: {
          tags: ['emprestimos'],
          summary: 'cria um novo empréstimo',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              emprestimoId: z.string(),
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

        if (cannot('create', 'Emprestimo')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const emprestimoDTO = req.body

        const emprestimo = await createEmprestimoUseCase.execute(
          emprestimoDTO,
          membership,
        )

        return res.status(201).send({ emprestimoId: emprestimo.id })
      },
    )
}
