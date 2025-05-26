import { z } from 'zod'

import { api } from '../api/axios'

const updateOrganizationSchema = z.object({
  name: z.string(),
  domain: z.string().nullish(),
  shouldAttachUsersByDomain: z.boolean().optional(),
})

export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>

export async function updateOrganization(
  orgSlug: string,
  { name, domain, shouldAttachUsersByDomain }: UpdateOrganizationDto,
) {
  await api.patch(`/organizations/${orgSlug}`, {
    name,
    domain,
    shouldAttachUsersByDomain,
  })
}
