import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import type {
  CreateOrganizationDto,
  CreateOrganizationResponse,
} from '../../http/orgs/create-organization'
import { createOrganization } from '../../http/orgs/create-organization'
import type { GetOrganizationResponse } from '../../http/orgs/get-organization'
import { getOrganization } from '../../http/orgs/get-organization'
import type { GetOrganizationsResponse } from '../../http/orgs/get-organizations'
import { getOrganizations } from '../../http/orgs/get-organizations'
import type { ListOrganizationsResponse } from '../../http/orgs/list-organizations'
import { listOrganizations } from '../../http/orgs/list-organizations'
import { shtutdownOrganization } from '../../http/orgs/shutdown-organization'
import type { UpdateOrganizationDto } from '../../http/orgs/update-organization'
import { updateOrganization } from '../../http/orgs/update-organization'
import type { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.ORGANIZATION

export function useOrgQueries() {
  const queryClient = useQueryClient()
  const useGetBySlug = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetOrganizationResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getOrganization(orgSlug),
    })
  }

  const useGetAll = (
    queryOptions?: Omit<
      UseQueryOptions<GetOrganizationsResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey],
      queryFn: () => getOrganizations(),
    })
  }

  const useListPaginated = (
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListOrganizationsResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, 'paginated', page, size, sort],
      queryFn: () => listOrganizations({ page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateOrganizationResponse,
        AxiosError<ErrorResponse>,
        CreateOrganizationDto
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: (data) => createOrganization(data),
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
        { orgSlug: string; data: UpdateOrganizationDto }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => updateOrganization(orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  const useShtutdown = (
    mutationOptions?: Omit<
      UseMutationOptions<void, AxiosError<ErrorResponse>, string>,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: (orgSlug) => shtutdownOrganization(orgSlug),
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
    useGetBySlug,
    useListPaginated,
    useGetAll,
    useCreate,
    useUpdate,
    useShtutdown,
  }
}
