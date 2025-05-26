import { api } from '../api/axios'

export interface GetOrganizationResponse {
  organization: {
    id: string
    name: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
  }
}

export async function getOrganization(orgSlug: string) {
  const result = await api.get<GetOrganizationResponse>(
    `/organizations/${orgSlug}`,
  )
  return result.data
}
