import { api } from '../api/axios'

export async function deleteNfeCompra(nfeCompraId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/nfes-compra/${nfeCompraId}`)
}
