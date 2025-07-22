import type { Unidade } from '../../constants/Unidade'
import type { Page, PageParams } from '../../types'
import { api } from '../api/axios'

export interface ListRequisicoesEstoqueResponse {
  id: string
  dataRequisicao: string
  valorTotal: number
  ordemProducao: string
  obs: string
  requisitante: {
    id: string
    nome: string
  }
  setor: {
    id: string
    nome: string
  }
  armazem: {
    id: string
    nome: string
  }
  itens: {
    id: string
    quantidade: number
    unidade: Unidade
    valorUnitario: number
    insumo: {
      id: string
      descricao: string
      valorUntMed: number
      undEstoque: Unidade
    }
  }[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function listRequisicoesEstoque(
  orgSlug: string,
  { page = 0, size = 20, sort }: PageParams = {},
) {
  const response = await api.get<Page<ListRequisicoesEstoqueResponse>>(
    `/organizations/${orgSlug}/requisicoes-estoque/list`,
    {
      params: { page, size, sort },
    },
  )
  return response.data
}
