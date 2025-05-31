import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const updateEmprestimoSchema = z.object({
  dataEmprestimo: z.date(),
  previsaoDevolucao: z.date().nullable(),
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
          dataDevolucao: z.date(),
          quantidade: z.coerce.number(),
          unidade: z.nativeEnum(Unidade),
          valorUnitario: z.coerce.number(),
          insumoId: z.string().uuid(),
        }),
      ),
    }),
  ),
})

export type UpdateEmprestimoDTO = z.infer<typeof updateEmprestimoSchema>

export async function updateEmprestimo(
  id: string,
  orgSlug: string,
  dto: UpdateEmprestimoDTO,
) {
  await api.put(`/organizations/${orgSlug}/emprestimos/${id}`, dto)
}
