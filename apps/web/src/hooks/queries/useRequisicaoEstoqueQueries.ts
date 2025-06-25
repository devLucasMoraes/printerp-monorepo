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
  createRequisicaoEstoque,
  CreateRequisicaoEstoqueDTO,
  CreateRequisicaoEstoqueResponse,
} from '../../http/requisicao-estoque/create-requisicao-estoque'
import { deleteRequisicaoEstoque } from '../../http/requisicao-estoque/delete-requisicao-estoque'
import {
  getAllRequisicoesEstoque,
  GetAllRequisicoesEstoqueResponse,
} from '../../http/requisicao-estoque/get-all-requisicoes-estoque'
import {
  getRequisicaoEstoque,
  GetRequisicaoEstoqueResponse,
} from '../../http/requisicao-estoque/get-requisicao-estoque'
import {
  listRequisicoesEstoque,
  ListRequisicoesEstoqueResponse,
} from '../../http/requisicao-estoque/list-requisicoes-estoque'
import {
  updateRequisicaoEstoque,
  UpdateRequisicaoEstoqueDTO,
} from '../../http/requisicao-estoque/update-requisicao-estoque'
import { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.REQUISICAO_ESTOQUE

export function useRequisicaoEstoqueQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetRequisicaoEstoqueResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getRequisicaoEstoque(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<
        GetAllRequisicoesEstoqueResponse[],
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllRequisicoesEstoque(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListRequisicoesEstoqueResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listRequisicoesEstoque(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateRequisicaoEstoqueResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateRequisicaoEstoqueDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createRequisicaoEstoque(orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  const useUpdate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        void,
        AxiosError<ErrorResponse>,
        { id: string; orgSlug: string; data: UpdateRequisicaoEstoqueDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateRequisicaoEstoque(id, orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  const useDelete = (
    mutationOptions?: Omit<
      UseMutationOptions<
        void,
        AxiosError<ErrorResponse>,
        { id: string; orgSlug: string }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug }) => deleteRequisicaoEstoque(id, orgSlug),
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
    useGetById,
    useListPaginated,
    useGetAll,
    useCreate,
    useUpdate,
    useDelete,
  }
}
