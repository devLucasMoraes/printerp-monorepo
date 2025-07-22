import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type {
  CreateRequisitanteDTO,
  CreateRequisitanteResponse,
} from '../../http/requisitante/create-requisitante'
import { createRequisitante } from '../../http/requisitante/create-requisitante'
import { deleteRequisitante } from '../../http/requisitante/delete-requisitante'
import type { GetAllRequisitantesResponse } from '../../http/requisitante/get-all-requisitantes'
import { getAllRequisitantes } from '../../http/requisitante/get-all-requisitantes'
import type { GetRequisitanteResponse } from '../../http/requisitante/get-requisitante'
import { getRequisitante } from '../../http/requisitante/get-requisitante'
import type { ListRequisitantesResponse } from '../../http/requisitante/list-requisitantes'
import { listRequisitantes } from '../../http/requisitante/list-requisitantes'
import type { UpdateRequisitanteDTO } from '../../http/requisitante/update-requisitante'
import { updateRequisitante } from '../../http/requisitante/update-requisitante'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.REQUISITANTE

export function useRequisitanteQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetRequisitanteResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getRequisitante(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllRequisitantesResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllRequisitantes(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListRequisitantesResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listRequisitantes(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateRequisitanteResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateRequisitanteDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createRequisitante(orgSlug, data),
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
        { id: string; orgSlug: string; data: UpdateRequisitanteDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateRequisitante(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => deleteRequisitante(id, orgSlug),
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
