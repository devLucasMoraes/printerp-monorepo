import { FastifyInstance } from 'fastify'

import { createEmprestimo } from './create-emprestimo'
import { deleteEmprestimo } from './delete-emprestimo'
import { getAllEmprestimos } from './get-all-emprestimos'
import { getEmprestimo } from './get-emprestimo'
import { listEmprestimos } from './list-emprestimos'
import { updateEmprestimo } from './update-emprestimo'

export default async function (app: FastifyInstance) {
  app.register(createEmprestimo)
  app.register(deleteEmprestimo)
  app.register(getAllEmprestimos)
  app.register(getEmprestimo)
  app.register(listEmprestimos)
  app.register(updateEmprestimo)
}
