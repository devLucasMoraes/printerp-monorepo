import { api } from '../api/axios'

export async function deleteRequisicaoEstoque(
  requisicaoEstoqueId: string,
  orgSlug: string,
) {
  await api.delete(
    `/organizations/${orgSlug}/requisicoes-estoque/${requisicaoEstoqueId}`,
  )
}
