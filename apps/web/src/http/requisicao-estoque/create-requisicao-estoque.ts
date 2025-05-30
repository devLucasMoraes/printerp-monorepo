import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const createRequisicaoEstoqueSchema = z.object({
  dataRequisicao: z.string(),
  ordemProducao: z.string().nullable(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitanteId: z.string(),
  setorId: z.string(),
  armazemId: z.string(),
  itens: z.array(
    z.object({
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string(),
    }),
  ),
})

export type CreateRequisicaoEstoqueDTO = z.infer<
  typeof createRequisicaoEstoqueSchema
>

export interface CreateRequisicaoEstoqueResponse {
  requisicaoEstoqueId: string
}

export async function createRequisicaoEstoque(
  orgSlug: string,
  dto: CreateRequisicaoEstoqueDTO,
) {
  const result = await api.post<CreateRequisicaoEstoqueResponse>(
    `/organizations/${orgSlug}/requisicoes-estoque`,
    dto,
  )
  return result.data
}
