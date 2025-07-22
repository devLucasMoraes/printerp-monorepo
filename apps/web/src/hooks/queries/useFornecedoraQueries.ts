import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type {
  CreateFornecedoraDTO,
  CreateFornecedoraResponse,
} from '../../http/fornecedora/create-fornecedora'
import { createFornecedora } from '../../http/fornecedora/create-fornecedora'
import { deleteFornecedora } from '../../http/fornecedora/delete-fornecedora'
import type { GetAllFornecedorasResponse } from '../../http/fornecedora/get-all-fornecedoras'
import { getAllFornecedoras } from '../../http/fornecedora/get-all-fornecedoras'
import type { GetFornecedoraResponse } from '../../http/fornecedora/get-fornecedora'
import { getFornecedora } from '../../http/fornecedora/get-fornecedora'
import type { GetFornecedoraByCnpjResponse } from '../../http/fornecedora/get-fornecedora-by-cnpj'
import { getFornecedoraByCnpj } from '../../http/fornecedora/get-fornecedora-by-cnpj'
import type { ListFornecedorasResponse } from '../../http/fornecedora/list-fornecedoras'
import { listFornecedoras } from '../../http/fornecedora/list-fornecedoras'
import type { UpdateFornecedoraDTO } from '../../http/fornecedora/update-fornecedora'
import { updateFornecedora } from '../../http/fornecedora/update-fornecedora'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.FORNECEDORA

export function useFornecedoraQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetFornecedoraResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getFornecedora(orgSlug, id),
    })
  }

  const useGetByCnpj = (
    cnpj: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetFornecedoraByCnpjResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, cnpj],
      queryFn: () => getFornecedoraByCnpj(orgSlug, cnpj),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllFornecedorasResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllFornecedoras(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListFornecedorasResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listFornecedoras(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateFornecedoraResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateFornecedoraDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createFornecedora(orgSlug, data),
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
        { id: string; orgSlug: string; data: UpdateFornecedoraDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateFornecedora(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => deleteFornecedora(id, orgSlug),
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
    useGetByCnpj,
    useListPaginated,
    useGetAll,
    useCreate,
    useUpdate,
    useDelete,
  }
}
