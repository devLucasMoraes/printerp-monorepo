import { z } from 'zod'

import { api } from '../api/axios'

export const updateRequisitanteSchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type UpdateRequisitanteDTO = z.infer<typeof updateRequisitanteSchema>

export async function updateRequisitante(
  id: string,
  orgSlug: string,
  data: UpdateRequisitanteDTO,
) {
  await api.put(`/organizations/${orgSlug}/requisitantes/${id}`, data)
}
