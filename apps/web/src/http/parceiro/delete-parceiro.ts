import { api } from '../api/axios'

export async function deleteParceiro(parceiroId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/parceiros/${parceiroId}`)
}
