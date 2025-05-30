import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const updateInsumoSchema = z.object({
  descricao: z.string().nonempty(),
  undEstoque: z.nativeEnum(Unidade),
  categoriaId: z.string().uuid(),
  valorUntMed: z.number().optional(),
  valorUntMedAuto: z.boolean().optional(),
  permiteEstoqueNegativo: z.boolean().optional(),
  estoqueMinimo: z.number().optional(),
})

export type UpdateInsumoDTO = z.infer<typeof updateInsumoSchema>

export async function updateInsumo(
  id: string,
  orgSlug: string,
  data: UpdateInsumoDTO,
) {
  await api.put(`/organizations/${orgSlug}/insumos/${id}`, data)
}
