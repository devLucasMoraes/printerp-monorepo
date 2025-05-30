import { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export interface GetAllRequisicoesEstoqueResponse {
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

export async function getAllRequisicoesEstoque(orgSlug: string) {
  const response = await api.get<GetAllRequisicoesEstoqueResponse[]>(
    `/organizations/${orgSlug}/requisicoes-estoque`,
  )
  return response.data
}
