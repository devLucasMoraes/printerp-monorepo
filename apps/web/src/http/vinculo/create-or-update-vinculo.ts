import { z } from 'zod'

import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export const createOrUpdateVinculoSchema = z.object({
  cod: z.string(),
  undCompra: z.nativeEnum(Unidade),
  possuiConversao: z.boolean(),
  qtdeEmbalagem: z.number().nullable(),
  fornecedoraId: z.string().uuid(),
  insumoId: z.string().uuid(),
})

export type CreateOrUpdateVinculoDto = z.infer<
  typeof createOrUpdateVinculoSchema
>

export interface CreateOrUpdateVinculoResponse {
  id: string
  cod: string
  undCompra: Unidade
  possuiConversao: boolean
  qtdeEmbalagem: number | null
  insumo: {
    id: string
    descricao: string
    undEstoque: Unidade
  }
  fornecedoraId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function createOrUpdateVinculo(
  orgSlug: string,
  dto: CreateOrUpdateVinculoDto,
) {
  const response = await api.post<CreateOrUpdateVinculoResponse>(
    `/organizations/${orgSlug}/vinculos`,
    dto,
  )
  return response.data
}
