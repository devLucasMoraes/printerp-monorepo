import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Fornecedora } from '../../entities/Fornecedora'

export const deleteFornecedoraUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.fornecedora.manager.transaction(async (manager) => {
      const fornecedora = await manager.findOne(Fornecedora, {
        where: { id },
        select: ['id', 'deletedAt'],
      })

      if (!fornecedora) {
        throw new BadRequestError('Fornecedora não encontrada')
      }

      if (fornecedora.deletedAt) {
        throw new BadRequestError('Fornecedora já está desativada')
      }

      await manager.update(Fornecedora, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Fornecedora, id)
    })
  },
}
