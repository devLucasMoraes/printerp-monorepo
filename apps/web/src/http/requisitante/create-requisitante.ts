import { z } from 'zod'

import { api } from '../api/axios'

export const createRequisitanteSchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type CreateRequisitanteDTO = z.infer<typeof createRequisitanteSchema>

export interface CreateRequisitanteResponse {
  requisitanteId: string
}

export async function createRequisitante(
  orgSlug: string,
  data: CreateRequisitanteDTO,
) {
  const result = await api.post<CreateRequisitanteResponse>(
    `/organizations/${orgSlug}/requisitantes`,
    data,
  )
  return result.data
}
