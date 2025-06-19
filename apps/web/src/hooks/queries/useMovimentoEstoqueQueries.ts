import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  listMovimentacoesEstoque,
  ListMovimentacoesEstoqueResponse,
} from '../../http/movimentacao-estoque/list-movimentacoes-estoque'
import { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = 'movimento-estoque'
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
    const { page = 0, size = 20, sort = 'ASC', filters = {} } = params

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
