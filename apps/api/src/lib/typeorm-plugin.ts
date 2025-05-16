import 'reflect-metadata' // Importar antes de qualquer uso de decorators do TypeORM

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { DataSource } from 'typeorm'

import { AppDataSource } from '@/database/data-source'

declare module 'fastify' {
  interface FastifyInstance {
    db: { dataSource: DataSource }
  }
}

const typeormPlugin: FastifyPluginAsync = async (fastify) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
    fastify.log.info('Database initialized')
  }
  fastify.decorate('db', { dataSource: AppDataSource })

  fastify.addHook('onClose', async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
      fastify.log.info('Database connection closed')
    }
  })
}

export default fp(typeormPlugin, {
  name: 'typeorm-plugin',
  fastify: '5.x',
})
