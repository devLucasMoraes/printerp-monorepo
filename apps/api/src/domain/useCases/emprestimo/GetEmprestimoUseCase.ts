import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Emprestimo } from '../../entities/Emprestimo'

export const getEmprestimoUseCase = {
  async execute(id: string): Promise<Emprestimo> {
    const emprestimo = await repository.emprestimo.findOneWithRelations(id)

    if (!emprestimo) {
      throw new BadRequestError('Empréstimo não encontrado')
    }

    return emprestimo
  },
}
