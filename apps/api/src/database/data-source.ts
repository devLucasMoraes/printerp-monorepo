import 'reflect-metadata'

import { env } from '@printerp/env-server'
import { join } from 'path'
import { DataSource } from 'typeorm'

import { entities } from '@/domain/entities'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities,
  migrations: [join(__dirname, './migrations/**/*.{ts,js}')],
  subscribers: [join(__dirname, './subscribers/**/*.{ts,js}')],
})
