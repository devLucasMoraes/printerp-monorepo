import { api } from '../api/axios'

export async function deleteSetor(setorId: string, orgSlug: string) {
  await api.delete(`/organizacoes/${orgSlug}/setores/${setorId}`)
}
