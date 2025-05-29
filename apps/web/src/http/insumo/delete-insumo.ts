import { api } from '../api/axios'

export async function deleteInsumo(insumoId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/insumos/${insumoId}`)
}
