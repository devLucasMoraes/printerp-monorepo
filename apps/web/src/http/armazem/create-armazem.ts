import { z } from 'zod'

import { api } from '../api/axios'

export const createArmazemSchema = z.object({
  nome: z.string(),
})

export type CreateArmazemDTO = z.infer<typeof createArmazemSchema>

export interface CreateArmazemResponse {
  armazemId: string
}

export async function createArmazem(orgSlug: string, data: CreateArmazemDTO) {
  const response = await api.post<CreateArmazemResponse>(
    `/organizations/${orgSlug}/armazens`,
    data,
  )
  return response.data
}
