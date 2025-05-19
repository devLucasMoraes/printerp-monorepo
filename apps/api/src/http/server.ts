import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from '@printerp/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import typeormPlugin from '@/lib/typeorm-plugin'

import { errorHandler } from './error-handler'
import { createArmazem } from './routes/armazem/create-armazem'
import { deleteArmazem } from './routes/armazem/delete-armazem'
import { getAllArmazens } from './routes/armazem/get-all-armazens'
import { getArmazem } from './routes/armazem/get-armazem'
import { listArmazens } from './routes/armazem/list-armazens'
import { updateArmazem } from './routes/armazem/update-armazem'
import { authWithPassword } from './routes/auth/auth-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { reqPasswordRecover } from './routes/auth/req-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { createCategoria } from './routes/categoria/create-categoria'
import { deleteCategoria } from './routes/categoria/delete-categoria'
import { getAllCategorias } from './routes/categoria/get-all-categorias'
import { getCategoria } from './routes/categoria/get-categoria'
import { listCategorias } from './routes/categoria/list-categorias'
import { updateCategoria } from './routes/categoria/update-categoria'
import { createInsumo } from './routes/insumo/create-insumo'
import { deleteInsumo } from './routes/insumo/delete-insumo'
import { getAllInsumos } from './routes/insumo/get-all-insumos'
import { getInsumo } from './routes/insumo/get-insumo'
import { listInsumos } from './routes/insumo/list-insumos'
import { updateInsumo } from './routes/insumo/update-insumo'
import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { shtutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { updateOrganization } from './routes/orgs/update-organization'
import { createRequisitante } from './routes/requisitante/create-requisitante'
import { deleteRequisitante } from './routes/requisitante/delete-requisitante'
import { getAllRequisitantes } from './routes/requisitante/get-all-requisitantes'
import { getRequisitante } from './routes/requisitante/get-requisitante'
import { listRequisitantes } from './routes/requisitante/list-requisitantes'
import { updateRequisitante } from './routes/requisitante/update-requisitante'
import { createSetor } from './routes/setor/create-setor'
import { deleteSetor } from './routes/setor/delete-setor'
import { getAllSetores } from './routes/setor/get-all-setores'
import { getSetor } from './routes/setor/get-setor'
import { listSetores } from './routes/setor/list-setores'
import { updateSetor } from './routes/setor/update-setor'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(typeormPlugin)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full stack Next.js SaaS app with multi-tenancy & RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authWithPassword)
app.register(getProfile)
app.register(reqPasswordRecover)
app.register(resetPassword)

app.register(createOrganization)
app.register(getMembership)
app.register(getOrganizations)
app.register(getOrganization)
app.register(updateOrganization)
app.register(shtutdownOrganization)
app.register(transferOrganization)

app.register(createCategoria)
app.register(deleteCategoria)
app.register(getCategoria)
app.register(getAllCategorias)
app.register(updateCategoria)
app.register(listCategorias)

app.register(createInsumo)
app.register(getInsumo)
app.register(getAllInsumos)
app.register(listInsumos)
app.register(updateInsumo)
app.register(deleteInsumo)

app.register(updateSetor)
app.register(listSetores)
app.register(getSetor)
app.register(getAllSetores)
app.register(deleteSetor)
app.register(createSetor)

app.register(createRequisitante)
app.register(deleteRequisitante)
app.register(getAllRequisitantes)
app.register(getRequisitante)
app.register(listRequisitantes)
app.register(updateRequisitante)

app.register(createArmazem)
app.register(deleteArmazem)
app.register(getAllArmazens)
app.register(getArmazem)
app.register(listArmazens)
app.register(updateArmazem)

const start = async () => {
  console.log('Starting server...')
  try {
    await app.listen({
      port: env.SERVER_PORT,
    })
    console.log(`Server running at http://localhost:${env.SERVER_PORT}`)
    console.log(
      `Documentation available at http://localhost:${env.SERVER_PORT}/docs`,
    )
  } catch (err) {
    console.error(err)
    app.log.error(err)
    process.exit(1)
  }
}

start()
