import { z } from 'zod'

import { api } from '../api/axios'

export const updateSetorSchema = z.object({
  nome: z.string(),
})

export type UpdateSetorDTO = z.infer<typeof updateSetorSchema>

export async function updateSetor(
  id: string,
  orgSlug: string,
  data: UpdateSetorDTO,
) {
  await api.put(`/organizations/${orgSlug}/setores/${id}`, data)
}
