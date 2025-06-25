import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { Unidade } from '@/domain/entities/Unidade'
import { updateEmprestimoUseCase } from '@/domain/useCases/emprestimo/UpdateEmprestimoUseCase'
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
      id: z.string().uuid().nullable(),
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string().uuid(),
      devolucaoItens: z.array(
        z.object({
          id: z.string().uuid().nullable(),
          dataDevolucao: z.string(),
          quantidade: z.coerce.number(),
          unidade: z.nativeEnum(Unidade),
          valorUnitario: z.coerce.number(),
          insumoId: z.string().uuid(),
        }),
      ),
    }),
  ),
})

export type UpdateEmprestimoDTO = z.infer<typeof bodySchema>

export async function updateEmprestimo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:orgSlug/emprestimos/:emprestimoId',
      {
        schema: {
          tags: ['emprestimos'],
          summary: 'altera uma requisição de estoque',
          security: [{ bearerAuth: [] }],
          body: bodySchema,
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

        if (cannot('update', 'Emprestimo')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar esse recurso',
          )
        }

        const emprestimoDTO = req.body

        const { emprestimoId } = req.params

        await updateEmprestimoUseCase.execute(
          emprestimoId,
          emprestimoDTO,
          membership,
        )

        app.io.in(orgSlug).emit('invalidateEmprestimoCache', {
          operation: 'update',
          orgSlug,
          emprestimoId,
        })

        return res.status(204).send()
      },
    )
}
