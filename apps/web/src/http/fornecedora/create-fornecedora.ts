import { z } from 'zod'

import { api } from '../api/axios'

export const createFornecedoraSchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type CreateFornecedoraDTO = z.infer<typeof createFornecedoraSchema>

export interface CreateFornecedoraResponse {
  fornecedoraId: string
}

export async function createFornecedora(
  orgSlug: string,
  dto: CreateFornecedoraDTO,
) {
  const result = await api.post<CreateFornecedoraResponse>(
    `/organizations/${orgSlug}/fornecedoras`,
    dto,
  )
  return result.data
}
