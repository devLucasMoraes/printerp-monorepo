import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type {
  CreateEmprestimoDTO,
  CreateEmprestimoResponse,
} from '../../http/emprestimo/create-emprestimo'
import { createEmprestimo } from '../../http/emprestimo/create-emprestimo'
import { deleteEmprestimo } from '../../http/emprestimo/delete-emprestimo'
import type { GetAllEmprestimosResponse } from '../../http/emprestimo/get-all-emprestimos'
import { getAllEmprestimos } from '../../http/emprestimo/get-all-emprestimos'
import type { GetEmprestimoResponse } from '../../http/emprestimo/get-emprestimo'
import { getEmprestimo } from '../../http/emprestimo/get-emprestimo'
import type { ListEmprestimosResponse } from '../../http/emprestimo/list-emprestimos'
import { listEmprestimos } from '../../http/emprestimo/list-emprestimos'
import type { UpdateEmprestimoDTO } from '../../http/emprestimo/update-emprestimo'
import { updateEmprestimo } from '../../http/emprestimo/update-emprestimo'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.EMPRESTIMO

export function useEmprestimoQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetEmprestimoResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getEmprestimo(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllEmprestimosResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllEmprestimos(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<ListEmprestimosResponse>, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listEmprestimos(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateEmprestimoResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateEmprestimoDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createEmprestimo(orgSlug, data),
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
        { id: string; orgSlug: string; data: UpdateEmprestimoDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateEmprestimo(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => deleteEmprestimo(id, orgSlug),
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
