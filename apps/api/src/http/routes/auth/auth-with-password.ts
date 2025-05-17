import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'

import { BadRequestError } from '../../_errors/bad-request-error'

export async function authWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate user with password',
        body: z.object({
          email: z.string(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body

      const userFromEmail = await repository.user.findOne({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        throw new BadRequestError('invalid credentials')
      }

      if (userFromEmail.password === null) {
        throw new BadRequestError(
          'User does not have a password, use social login',
        )
      }

      const isPasswordValid = await compare(password, userFromEmail.password)

      if (!isPasswordValid) {
        throw new BadRequestError('invalid credentials')
      }

      const token = await res.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return res.status(201).send({ token })
    },
  )
}
