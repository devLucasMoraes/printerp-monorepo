import { z } from 'zod'

import { api } from '../api/axios'

export const updateTransportadoraSchema = z.object({
  nomeFantasia: z.string().nonempty(),
  razaoSocial: z.string().nonempty(),
  cnpj: z.string().nonempty(),
  fone: z.string().nonempty(),
})

export type UpdateTransportadoraDTO = z.infer<typeof updateTransportadoraSchema>

export async function updateTransportadora(
  id: string,
  orgSlug: string,
  data: UpdateTransportadoraDTO,
) {
  await api.put(`/organizations/${orgSlug}/transportadoras/${id}`, data)
}
