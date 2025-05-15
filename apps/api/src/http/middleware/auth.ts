import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { repository } from '@/domain/repositories'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    req.getCurrentUserId = async () => {
      try {
        const { sub } = await req.jwtVerify<{ sub: string }>()
        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }

    req.getUserMembership = async (slug: string) => {
      const userId = await req.getCurrentUserId()

      const member = await repository.member.findOne({
        where: {
          userId,
          organization: {
            slug,
          },
        },
        relations: {
          organization: true,
        },
      })

      if (!member) {
        throw new UnauthorizedError('You are not part of this organization')
      }

      const { organization } = member

      return {
        membership: member,
        organization,
      }
    }
  })
})
