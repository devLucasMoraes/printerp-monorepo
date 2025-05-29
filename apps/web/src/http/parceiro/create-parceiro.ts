import { z } from 'zod'

import { api } from '../api/axios'

export const createParceiroSchema = z.object({
  nome: z.string(),
  fone: z.string(),
})

export type CreateParceiroDTO = z.infer<typeof createParceiroSchema>

export interface CreateParceiroResponse {
  parceiroId: string
}

export async function createParceiro(orgSlug: string, data: CreateParceiroDTO) {
  const result = await api.post<CreateParceiroResponse>(
    `/organizations/${orgSlug}/parceiros`,
    data,
  )
  return result.data
}
