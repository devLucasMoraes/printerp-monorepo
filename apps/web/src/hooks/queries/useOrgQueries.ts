import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  createOrganization,
  CreateOrganizationDto,
  CreateOrganizationResponse,
} from '../../http/orgs/create-organization'
import {
  getOrganization,
  GetOrganizationResponse,
} from '../../http/orgs/get-organization'
import {
  getOrganizations,
  GetOrganizationsResponse,
} from '../../http/orgs/get-organizations'
import { shtutdownOrganization } from '../../http/orgs/shutdown-organization'
import {
  updateOrganization,
  UpdateOrganizationDto,
} from '../../http/orgs/update-organization'
import { ErrorResponse } from '../../types'

export function useOrgQueries() {
  const resourceKey = 'organizations'
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
    useGetAll,
    useCreate,
    useUpdate,
    useShtutdown,
  }
}
