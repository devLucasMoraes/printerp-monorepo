import { z } from 'zod'

import { api } from '../api/axios'

export const updateParceiroSchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type UpdateParceiroDTO = z.infer<typeof updateParceiroSchema>

export async function updateParceiro(
  id: string,
  orgSlug: string,
  data: UpdateParceiroDTO,
) {
  await api.put(`/organizations/${orgSlug}/parceiros/${id}`, data)
}
