import { api } from '../api/axios'

export interface InsumosPorSetorResponse {
  xaxisData: string[]
  series: {
    name: string
    data: number[]
  }[]
  totalGeral: number
}

export async function getChartInsumosPorSetor(
  orgSlug: string,
  periodo: string,
) {
  const response = await api.get<InsumosPorSetorResponse>(
    `/organizations/${orgSlug}/charts/insumos-por-setor/${periodo}`,
  )
  return response.data
}
