import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const updateRequisicaoEstoqueSchema = z.object({
  dataRequisicao: z.string(),
  ordemProducao: z.string().nullable(),
  valorTotal: z.number().nonnegative(),
  obs: z.string().nullable(),
  requisitanteId: z.string(),
  setorId: z.string(),
  armazemId: z.string(),
  itens: z.array(
    z.object({
      id: z.string().uuid().nullable(),
      quantidade: z.number().nonnegative(),
      unidade: z.nativeEnum(Unidade),
      valorUnitario: z.number().nonnegative(),
      insumoId: z.string(),
    }),
  ),
})

export type UpdateRequisicaoEstoqueDTO = z.infer<
  typeof updateRequisicaoEstoqueSchema
>

export async function updateRequisicaoEstoque(
  id: string,
  orgSlug: string,
  dto: UpdateRequisicaoEstoqueDTO,
) {
  await api.put(`/organizations/${orgSlug}/requisicoes-estoque/${id}`, dto)
}
