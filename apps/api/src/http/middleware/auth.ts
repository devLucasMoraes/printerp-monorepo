import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { repository } from '@/domain/repositories'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req) => {
    req.getCurrentUserId = async () => {
      try {
        const { sub, type } = await req.jwtVerify<{
          sub: string
          type: string
        }>()

        if (type !== 'access') {
          throw new UnauthorizedError('Invalid token type')
        }

        return sub
      } catch {
        throw new UnauthorizedError('Invalid auth token')
      }
    }

    req.getUserMembership = async (slug: string) => {
      const userId = await req.getCurrentUserId()

      const member = await repository.member
        .createQueryBuilder('member')
        .innerJoinAndSelect('member.user', 'user')
        .innerJoinAndSelect('member.organization', 'organization')
        .where('user.id = :userId', { userId })
        .andWhere('organization.slug = :slug', { slug })
        .getOne()

      if (!member) {
        throw new UnauthorizedError('Você não faz parte dessa organização')
      }

      console.log({ member })

      const { organization } = member

      return {
        membership: member,
        organization,
      }
    }
  })
})
