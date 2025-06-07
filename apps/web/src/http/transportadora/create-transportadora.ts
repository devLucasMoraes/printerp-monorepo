import { z } from 'zod'

import { api } from '../api/axios'

export const createTransportadoraSchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type CreateTransportadoraDTO = z.infer<typeof createTransportadoraSchema>

export interface CreateTransportadoraResponse {
  transportadoraId: string
}

export async function createTransportadora(
  orgSlug: string,
  dto: CreateTransportadoraDTO,
) {
  const result = await api.post<CreateTransportadoraResponse>(
    `/organizations/${orgSlug}/transportadoras`,
    dto,
  )
  return result.data
}
