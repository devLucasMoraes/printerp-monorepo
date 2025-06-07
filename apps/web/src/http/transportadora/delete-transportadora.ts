import { api } from '../api/axios'

export async function deleteTransportadora(
  transportadoraId: string,
  orgSlug: string,
) {
  await api.delete(
    `/organizations/${orgSlug}/transportadoras/${transportadoraId}`,
  )
}
