import { api } from '../api/axios'

export async function deleteRequisitante(
  requisitanteId: string,
  orgSlug: string,
) {
  await api.delete(`/organizations/${orgSlug}/requisitantes/${requisitanteId}`)
}
