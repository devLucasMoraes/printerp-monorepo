import { z } from 'zod'

import { chartSchema } from '../models/chart'

export const chartSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get')]),
  z.union([z.literal('Chart'), chartSchema]),
])

export type ChartSubject = z.infer<typeof chartSubject>
