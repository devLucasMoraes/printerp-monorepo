import { z } from 'zod'

import { api } from '../api/axios'

export const updateFornecedoraSchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type UpdateFornecedoraDTO = z.infer<typeof updateFornecedoraSchema>

export async function updateFornecedora(
  id: string,
  orgSlug: string,
  dto: UpdateFornecedoraDTO,
) {
  await api.put(`/organizations/${orgSlug}/fornecedoras/${id}`, dto)
}
