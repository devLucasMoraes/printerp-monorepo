import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  getChartInsumosPorSetor,
  InsumosPorSetorResponse,
} from '../../http/chart/get-chart-insumos-por-setor'
import {
  getChartSaidasMensais,
  SaidasMensaisResponse,
} from '../../http/chart/get-chart-saidas-mensais'
import { ErrorResponse } from '../../types'

export function useChartsQueries() {
  const resourceKey = 'charts'
  const useGetChartSaidasMensais = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<SaidasMensaisResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'saidas-mensais'],
      queryFn: () => getChartSaidasMensais(orgSlug),
    })
  }

  const useGetChartInsumosPorSetor = (
    orgSlug: string,
    periodo: string,
    queryOptions?: Omit<
      UseQueryOptions<InsumosPorSetorResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'insumos-por-setor', periodo],
      queryFn: () => getChartInsumosPorSetor(orgSlug, periodo),
    })
  }

  return {
    useGetChartSaidasMensais,
    useGetChartInsumosPorSetor,
  }
}
