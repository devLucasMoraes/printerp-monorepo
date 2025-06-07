import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { Transportadora } from '../../entities/Transportadora'

export const deleteTransportadoraUseCase = {
  async execute(id: string, membership: Member): Promise<void> {
    await repository.transportadora.manager.transaction(async (manager) => {
      const transportadora = await manager.findOne(Transportadora, {
        where: { id },
        select: ['id', 'deletedAt'],
      })

      if (!transportadora) {
        throw new BadRequestError('Transportadora não encontrada')
      }

      if (transportadora.deletedAt) {
        throw new BadRequestError('Transportadora já está desativada')
      }

      await manager.update(Transportadora, id, {
        deletedBy: membership.user.id,
      })

      await manager.softDelete(Transportadora, id)
    })
  },
}
