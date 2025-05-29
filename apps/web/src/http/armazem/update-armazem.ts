import { z } from 'zod'

import { api } from '../api/axios'

export const updateArmazemSchema = z.object({
  nome: z.string(),
})

export type UpdateArmazemDTO = z.infer<typeof updateArmazemSchema>

export async function updateArmazem(
  id: string,
  orgSlug: string,
  data: UpdateArmazemDTO,
) {
  await api.put(`/organizations/${orgSlug}/armazens/${id}`, data)
}
