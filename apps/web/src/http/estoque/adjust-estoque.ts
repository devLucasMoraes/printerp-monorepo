import { z } from 'zod'

import { api } from '../api/axios'

export const adjustEstoqueSchema = z.object({
  quantidade: z.number(),
})

export type AdjustEstoqueDTO = z.infer<typeof adjustEstoqueSchema>

export async function adjustEstoque(
  id: string,
  orgSlug: string,
  data: AdjustEstoqueDTO,
) {
  await api.put(`/organizations/${orgSlug}/estoques/adjust/${id}`, data)
}
