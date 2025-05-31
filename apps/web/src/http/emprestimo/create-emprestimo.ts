import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const createEmprestimoSchema = z.object({
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
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string().uuid(),
    }),
  ),
})

export type CreateEmprestimoDTO = z.infer<typeof createEmprestimoSchema>

export interface CreateEmprestimoResponse {
  emprestimoId: string
}

export async function createEmprestimo(
  orgSlug: string,
  dto: CreateEmprestimoDTO,
) {
  const result = await api.post<CreateEmprestimoResponse>(
    `/organizations/${orgSlug}/emprestimos`,
    dto,
  )
  return result.data
}
