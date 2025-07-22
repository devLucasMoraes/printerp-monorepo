import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type { InsumosPorSetorResponse } from '../../http/chart/get-chart-insumos-por-setor'
import { getChartInsumosPorSetor } from '../../http/chart/get-chart-insumos-por-setor'
import type { SaidasMensaisResponse } from '../../http/chart/get-chart-saidas-mensais'
import { getChartSaidasMensais } from '../../http/chart/get-chart-saidas-mensais'
import type { ErrorResponse } from '../../types'

const resourceKey = ResourceKeys.CHARTS

export function useChartsQueries() {
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
