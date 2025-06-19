import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  adjustEstoque,
  AdjustEstoqueDTO,
} from '../../http/estoque/adjust-estoque'
import {
  listEstoques,
  ListEstoquesResponse,
} from '../../http/estoque/list-estoques'
import { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = 'estoque'
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
    const { page = 0, size = 20, sort = 'ASC', filters = {} } = params

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
