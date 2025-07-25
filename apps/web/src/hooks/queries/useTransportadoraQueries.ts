import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type {
  CreateTransportadoraDTO,
  CreateTransportadoraResponse,
} from '../../http/transportadora/create-transportadora'
import { createTransportadora } from '../../http/transportadora/create-transportadora'
import { deleteTransportadora } from '../../http/transportadora/delete-transportadora'
import type { GetAllTransportadorasResponse } from '../../http/transportadora/get-all-transportadoras'
import { getAllTransportadoras } from '../../http/transportadora/get-all-transportadoras'
import type { GetTransportadoraResponse } from '../../http/transportadora/get-transportadora'
import { getTransportadora } from '../../http/transportadora/get-transportadora'
import type { GetTransportadoraByCnpjResponse } from '../../http/transportadora/get-transportadora-by-cnpj'
import { getTransportadoraByCnpj } from '../../http/transportadora/get-transportadora-by-cnpj'
import type { ListTransportadorasResponse } from '../../http/transportadora/list-transportadoras'
import { listTransportadoras } from '../../http/transportadora/list-transportadoras'
import type { UpdateTransportadoraDTO } from '../../http/transportadora/update-transportadora'
import { updateTransportadora } from '../../http/transportadora/update-transportadora'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.TRANSPORTADORA

export function useTransportadoraQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetTransportadoraResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getTransportadora(orgSlug, id),
    })
  }

  const useGetByCnpj = (
    cnpj: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<
        GetTransportadoraByCnpjResponse,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, cnpj],
      queryFn: () => getTransportadoraByCnpj(orgSlug, cnpj),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<
        GetAllTransportadorasResponse[],
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllTransportadoras(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListTransportadorasResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listTransportadoras(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateTransportadoraResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateTransportadoraDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createTransportadora(orgSlug, data),
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
        { id: string; orgSlug: string; data: UpdateTransportadoraDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateTransportadora(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => deleteTransportadora(id, orgSlug),
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
