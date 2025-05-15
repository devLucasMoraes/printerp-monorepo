import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { DataSource } from 'typeorm'

import { AppDataSource } from '@/database/data-source'

// Adicione esta interface para estender o tipo do Fastify
declare module 'fastify' {
  interface FastifyInstance {
    db: {
      dataSource: DataSource
    }
  }
}

const typeormPlugin: FastifyPluginAsync = async (fastify) => {
  try {
    // Inicializa a conexão com o TypeORM
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      fastify.log.info('Database connection initialized successfully')
    }

    // Adiciona o DataSource à instância do Fastify
    fastify.decorate('db', {
      dataSource: AppDataSource,
    })

    // Fechar a conexão quando o servidor for encerrado
    fastify.addHook('onClose', async () => {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy()
        fastify.log.info('Database connection closed')
      }
    })
  } catch (error) {
    fastify.log.error('Error connecting to database', error)
    throw error
  }
}

export default fp(typeormPlugin, {
  name: 'typeorm',
  fastify: '4.x',
})
