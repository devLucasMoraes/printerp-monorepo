import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export interface GetVinculoByCodResponse {
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

export async function getVinculoByCod(orgSlug: string, cod: string) {
  const response = await api.get<GetVinculoByCodResponse>(
    `/organizations/${orgSlug}/vinculos/cod/${cod}`,
  )
  return response.data
}
