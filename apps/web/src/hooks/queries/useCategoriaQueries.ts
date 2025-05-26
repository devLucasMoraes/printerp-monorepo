import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  createCategoria,
  CreateCategoriaDTO,
  CreateCategoriaResponse,
} from '../../http/categoria/create-categoria'
import { deleteCategoria } from '../../http/categoria/delete-categoria'
import {
  getAllCategorias,
  GetAllCategoriasResponse,
} from '../../http/categoria/get-all-categorias'
import {
  GetAllCategoriaResponse,
  getCategoria,
} from '../../http/categoria/get-categoria'
import {
  listCategorias,
  ListCatgoriasResponse,
} from '../../http/categoria/list-categorias'
import {
  updateCategoria,
  UpdateCategoriaDTO,
  UpdateCategoriaResponse,
} from '../../http/categoria/update-categoria'
import { ErrorResponse, Page, PageParams } from '../../types'

export function useCategoriaQueries() {
  const resourceKey = 'categoria'
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllCategoriaResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getCategoria(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllCategoriasResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllCategorias(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<ListCatgoriasResponse>, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listCategorias(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateCategoriaResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateCategoriaDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createCategoria(orgSlug, data),
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
        UpdateCategoriaResponse,
        AxiosError<ErrorResponse>,
        { id: string; orgSlug: string; data: UpdateCategoriaDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) => updateCategoria(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => deleteCategoria(id, orgSlug),
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
