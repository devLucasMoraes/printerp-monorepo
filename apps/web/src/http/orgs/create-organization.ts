import { z } from 'zod'

import { api } from '../api/axios'

export const createOrganizationSchema = z.object({
  name: z.string(),
  domain: z.string().nullish(),
  shouldAttachUsersByDomain: z.boolean().optional(),
})

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>

export interface CreateOrganizationResponse {
  organizationId: string
  slug: string
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationDto) {
  const result = await api.post<CreateOrganizationResponse>('/organizations', {
    name,
    domain,
    shouldAttachUsersByDomain,
  })
  return result.data
}
