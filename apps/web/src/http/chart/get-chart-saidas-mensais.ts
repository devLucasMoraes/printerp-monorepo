import { api } from '../api/axios'

export interface SaidasMensaisResponse {
  total: number
  percentual: number
  seriesData: number[]
  xaxisData: string[]
}
export async function getChartSaidasMensais(orgSlug: string) {
  const response = await api.get<SaidasMensaisResponse>(
    `/organizations/${orgSlug}/charts/saidas-mensais`,
  )
  return response.data
}
