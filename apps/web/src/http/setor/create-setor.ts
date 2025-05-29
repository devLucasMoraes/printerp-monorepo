import { z } from 'zod'

import { api } from '../api/axios'

export const createSetorSchema = z.object({
  nome: z.string(),
})

export type CreateSetorDTO = z.infer<typeof createSetorSchema>

export type CreateSetorResponse = {
  setorId: string
}

export async function createSetor(orgSlug: string, { nome }: CreateSetorDTO) {
  const result = await api.post<CreateSetorResponse>(
    `/organizations/${orgSlug}/setores`,
    {
      nome,
    },
  )
  return result.data
}
