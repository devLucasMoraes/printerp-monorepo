import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { repository } from '@/domain/repositories'

import { BadRequestError } from '../../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/v1/sign-up',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new user',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (req, res) => {
      const { name, email, password } = req.body
      const userWithSameEmail = await repository.user.findOne({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        throw new BadRequestError(
          'User with this email already exists, please login',
        )
      }

      const [, domain] = email.split('@')

      const autoJoinOrganization = await repository.organization.findOne({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const passwordHash = await hash(password, 6)

      const userData = repository.user.create({
        name,
        username: email,
        email,
        password: passwordHash,
      })

      const user = await repository.user.save(userData)

      if (autoJoinOrganization) {
        const memberData = repository.member.create({
          user,
          organization: autoJoinOrganization,
        })

        await repository.member.save(memberData)
      }

      return res.status(201).send({
        message: 'User created successfully',
      })
    },
  )
}
