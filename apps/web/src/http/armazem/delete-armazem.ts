import { api } from '../api/axios'

export async function deleteArmazem(armazemId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/armazens/${armazemId}`)
}
