import type { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export interface GetRequisicaoEstoqueResponse {
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

export async function getRequisicaoEstoque(
  orgSlug: string,
  requisicaoEstoqueId: string,
) {
  const response = await api.get<GetRequisicaoEstoqueResponse>(
    `/organizations/${orgSlug}/requisicoes-estoque/${requisicaoEstoqueId}`,
  )
  return response.data
}
