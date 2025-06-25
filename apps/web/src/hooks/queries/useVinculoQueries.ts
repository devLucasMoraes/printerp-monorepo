import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import {
  createOrUpdateVinculo,
  CreateOrUpdateVinculoDto,
  CreateOrUpdateVinculoResponse,
} from '../../http/vinculo/create-or-update-vinculo'
import {
  getVinculoByCod,
  GetVinculoByCodResponse,
} from '../../http/vinculo/get-vinculo-by-cod'
import { ErrorResponse } from '../../types'

const resourceKey = ResourceKeys.VINCULO

export function useVinculoQueries() {
  const queryClient = useQueryClient()

  const useGetByCod = (
    cod: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetVinculoByCodResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, cod],
      queryFn: () => getVinculoByCod(orgSlug, cod),
    })
  }

  const useCreateOrUpdate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateOrUpdateVinculoResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateOrUpdateVinculoDto }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createOrUpdateVinculo(orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  return {
    useGetByCod,
    useCreateOrUpdate,
  }
}
