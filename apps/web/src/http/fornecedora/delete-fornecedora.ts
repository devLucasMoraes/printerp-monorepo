import { api } from '../api/axios'

export async function deleteFornecedora(
  fornecedoraId: string,
  orgSlug: string,
) {
  await api.delete(`/organizations/${orgSlug}/fornecedoras/${fornecedoraId}`)
}
