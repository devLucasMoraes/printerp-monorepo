import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const _runtimeEnv =
  typeof process !== 'undefined' && typeof process.env === 'object'
    ? process.env
    : import.meta.env

export const env = createEnv({
  clientPrefix: 'VITE_',
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),

    DB_PORT: z.coerce.number().default(5432),
    DB_HOST: z.string().default('localhost'),
    DB_USERNAME: z.string().default('docker'),
    DB_PASSWORD: z.string().default('docker'),
    DB_DATABASE: z.string().default('printerp'),

    JWT_SECRET: z.string(),
    COOKIE_SECRET: z.string(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string().url(),
  },
  client: {
    VITE_URL_BASE_API: z.string().url(),
    VITE_SOCKET_URL: z.string().url(),
  },
  shared: {},
  runtimeEnv: _runtimeEnv,
  emptyStringAsUndefined: true,
})
