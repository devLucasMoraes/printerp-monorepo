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

import fastifyCookie from '@fastify/cookie'
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
import { logout } from './routes/auth/logout'
import { refreshToken } from './routes/auth/refresh-token'
import { reqPasswordRecover } from './routes/auth/req-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { createCategoria } from './routes/categoria/create-categoria'
import { deleteCategoria } from './routes/categoria/delete-categoria'
import { getAllCategorias } from './routes/categoria/get-all-categorias'
import { getCategoria } from './routes/categoria/get-categoria'
import { listCategorias } from './routes/categoria/list-categorias'
import { updateCategoria } from './routes/categoria/update-categoria'
import { createEmprestimo } from './routes/emprestimo/create-emprestimo'
import { deleteEmprestimo } from './routes/emprestimo/delete-emprestimo'
import { getAllEmprestimo } from './routes/emprestimo/get-all-emprestimos'
import { getEmprestimo } from './routes/emprestimo/get-emprestimo'
import { listEmprestimos } from './routes/emprestimo/list-emprestimos'
import { updateEmprestimo } from './routes/emprestimo/update-requisicao-estoque'
import { adjustEstoque } from './routes/estoque/adjust-estoque'
import { listEstoques } from './routes/estoque/list-estoques'
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
import { createParceiro } from './routes/parceiro/create-parceiro'
import { deleteParceiro } from './routes/parceiro/delete-parceiro'
import { getAllParceiros } from './routes/parceiro/get-all-parceiros'
import { getParceiro } from './routes/parceiro/get-parceiro'
import { listParceiros } from './routes/parceiro/list-parceiro'
import { updateParceiro } from './routes/parceiro/update-parceiro'
import { createRequisicaoEstoque } from './routes/requisicao-estoque/create-requisicao-estoque'
import { deleteRequisicaoEstoque } from './routes/requisicao-estoque/delete-requisicao-estoque'
import { getAllRequisicoesEstoque } from './routes/requisicao-estoque/get-all-requisicoes-estoque'
import { getRequisicaoEstoque } from './routes/requisicao-estoque/get-requisicao-estoque'
import { listRequisicaoEstoques } from './routes/requisicao-estoque/list-requisicoes-estoque'
import { updateRequisicaoEstoque } from './routes/requisicao-estoque/update-requisicao-estoque'
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
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
  parseOptions: {
    httpOnly: true,
    sameSite: 'strict',
  },
})

app.register(fastifyCors)

app.register(createAccount)
app.register(authWithPassword)
app.register(getProfile)
app.register(reqPasswordRecover)
app.register(resetPassword)
app.register(refreshToken)
app.register(logout)

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

app.register(adjustEstoque)
app.register(listEstoques)

app.register(createParceiro)
app.register(deleteParceiro)
app.register(getAllParceiros)
app.register(getParceiro)
app.register(listParceiros)
app.register(updateParceiro)

app.register(createRequisicaoEstoque)
app.register(deleteRequisicaoEstoque)
app.register(getAllRequisicoesEstoque)
app.register(getRequisicaoEstoque)
app.register(listRequisicaoEstoques)
app.register(updateRequisicaoEstoque)

app.register(createEmprestimo)
app.register(deleteEmprestimo)
app.register(getAllEmprestimo)
app.register(getEmprestimo)
app.register(listEmprestimos)
app.register(updateEmprestimo)

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
