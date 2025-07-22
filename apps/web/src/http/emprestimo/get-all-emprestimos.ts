import type { Unidade } from '../../constants/Unidade'
import { api } from '../api/axios'

export interface GetAllEmprestimosResponse {
  id: string
  dataEmprestimo: string
  previsaoDevolucao: string | null
  custoEstimado: number
  tipo: 'ENTRADA' | 'SAIDA'
  status: 'EM_ABERTO' | 'FECHADO'
  obs: string | null
  parceiro: {
    id: string
    nome: string
    fone: string
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
    devolucaoItens: {
      id: string
      dataDevolucao: string
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
  }[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedBy: string | null
  createdBy: string
  updatedBy: string
  organizationId: string
}

export async function getAllEmprestimos(orgSlug: string) {
  const response = await api.get<GetAllEmprestimosResponse[]>(
    `/organizations/${orgSlug}/emprestimos`,
  )
  return response.data
}
