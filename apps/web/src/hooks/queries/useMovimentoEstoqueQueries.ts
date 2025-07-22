import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type { ListMovimentacoesEstoqueResponse } from '../../http/movimentacao-estoque/list-movimentacoes-estoque'
import { listMovimentacoesEstoque } from '../../http/movimentacao-estoque/list-movimentacoes-estoque'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.MOVIMENTO_ESTOQUE
export function useMovimentoEstoqueQueries() {
  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListMovimentacoesEstoqueResponse>,
        AxiosError<ErrorResponse>
      >,
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
      queryFn: () =>
        listMovimentacoesEstoque(orgSlug, { page, size, sort, filters }),
    })
  }

  return {
    useListPaginated,
  }
}
