import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type { AdjustEstoqueDTO } from '../../http/estoque/adjust-estoque'
import { adjustEstoque } from '../../http/estoque/adjust-estoque'
import type { ListEstoquesResponse } from '../../http/estoque/list-estoques'
import { listEstoques } from '../../http/estoque/list-estoques'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.ESTOQUE

export function useEstoqueQueries() {
  const queryClient = useQueryClient()
  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<ListEstoquesResponse>, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const {
      page = 0,
      size = 20,
      sort = 'updatedAt,desc',
      filters = {},
    } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort, filters],
      queryFn: () => listEstoques(orgSlug, { page, size, sort, filters }),
    })
  }

  const useAdjustEstoque = (
    mutationOptions?: Omit<
      UseMutationOptions<
        void,
        AxiosError<ErrorResponse>,
        { id: string; orgSlug: string; data: AdjustEstoqueDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) => adjustEstoque(id, orgSlug, data),
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
    useListPaginated,
    useAdjustEstoque,
  }
}
