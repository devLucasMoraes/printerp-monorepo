import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateRequisicaoEstoqueDTO } from '@/http/routes/requisicao-estoque/update-requisicao-estoque'

import { Armazem } from '../../entities/Armazem'
import { Insumo } from '../../entities/Insumo'
import { RequisicaoEstoque } from '../../entities/RequisicaoEstoque'
import { Requisitante } from '../../entities/Requisitante'
import { Setor } from '../../entities/Setor'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const updateRequisicaoEstoqueUseCase = {
  async execute(
    id: string,
    dto: UpdateRequisicaoEstoqueDTO,
    membership: Member,
  ): Promise<RequisicaoEstoque> {
    return await repository.requisicaoEstoque.manager.transaction(
      async (manager) => {
        const requisicaoToUpdate = await findRequisicaoToUpdate(
          id,
          membership,
          manager,
        )
        await validate(requisicaoToUpdate, dto, membership, manager)
        await reverterMovimentacoes(requisicaoToUpdate, membership, manager)
        const requisicaoAtualizada = await updateRequisicao(
          requisicaoToUpdate,
          dto,
          membership,
          manager,
        )
        await processarNovasMovimentacoes(
          requisicaoAtualizada,
          membership,
          manager,
        )

        return requisicaoAtualizada
      },
    )
  },
}

async function findRequisicaoToUpdate(
  id: string,
  membership: Member,
  manager: EntityManager,
): Promise<RequisicaoEstoque> {
  const requisicao = await manager.findOne(RequisicaoEstoque, {
    where: { id, organizationId: membership.organization.id },
    relations: {
      requisitante: true,
      setor: true,
      armazem: true,
      itens: {
        insumo: true,
      },
    },
  })

  if (!requisicao) {
    throw new BadRequestError('RequisicaoEstoque not found')
  }

  return requisicao
}

async function validate(
  requisicaoToUpdate: RequisicaoEstoque,
  requisicaoDTO: UpdateRequisicaoEstoqueDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const requisitante = await manager.findOne(Requisitante, {
    where: {
      id: requisicaoDTO.requisitanteId,
      organizationId: membership.organization.id,
    },
  })

  if (!requisitante) {
    throw new BadRequestError('Requisitante não encontrado')
  }

  const setor = await manager.findOne(Setor, {
    where: {
      id: requisicaoDTO.setorId,
      organizationId: membership.organization.id,
    },
  })

  if (!setor) {
    throw new BadRequestError('Setor não encontrado')
  }

  const armazem = await manager.findOne(Armazem, {
    where: {
      id: requisicaoDTO.armazemId,
      organizationId: membership.organization.id,
    },
  })

  if (!armazem) {
    throw new BadRequestError('Armazem nao encontrado')
  }

  if (requisicaoDTO.itens.length === 0) {
    throw new BadRequestError('Requisicao Estoque deve ter pelo menos um item')
  }

  for (const itemDTO of requisicaoDTO.itens) {
    if (itemDTO.id !== null) {
      const itemPertence = requisicaoToUpdate.itens.some(
        (itemExistente) => itemExistente.id === itemDTO.id,
      )

      if (!itemPertence) {
        throw new BadRequestError(
          `Não é possível atualizar o item de outra requisição`,
        )
      }
    }
    const insumo = await manager.findOne(Insumo, {
      where: {
        id: itemDTO.insumoId,
        organizationId: membership.organization.id,
      },
    })
    if (!insumo) {
      throw new BadRequestError('Insumo nao encontrado')
    }
    if (itemDTO.quantidade <= 0) {
      throw new BadRequestError('Quantidade deve ser maior que zero')
    }
    if (itemDTO.unidade !== insumo.undEstoque) {
      throw new BadRequestError('Unidade deve ser igual a unidade do estoque')
    }
  }
}

async function reverterMovimentacoes(
  requisicaoToUpdate: RequisicaoEstoque,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of requisicaoToUpdate.itens) {
    await registrarEntradaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: requisicaoToUpdate.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigemId: requisicaoToUpdate.id,
        observacao: 'Movimentação gerada por atualização de requisição',
        tipoDocumento: 'REQUISICAO-ESTOQUE',
        data: requisicaoToUpdate.dataRequisicao,
        estorno: true,
      },
      membership,
      manager,
    )
  }
}

async function updateRequisicao(
  requisicaoToUpdate: RequisicaoEstoque,
  dto: UpdateRequisicaoEstoqueDTO,
  membership: Member,
  manager: EntityManager,
): Promise<RequisicaoEstoque> {
  const requisicaoDto = repository.requisicaoEstoque.create({
    dataRequisicao: dto.dataRequisicao,
    ordemProducao: dto.ordemProducao,
    valorTotal: dto.valorTotal,
    obs: dto.obs,
    requisitante: {
      id: dto.requisitanteId,
    },
    setor: {
      id: dto.setorId,
    },
    armazem: {
      id: dto.armazemId,
    },
    itens: dto.itens.map((itemDTO) => {
      if (itemDTO.id === null) {
        return {
          insumo: {
            id: itemDTO.insumoId,
          },
          quantidade: itemDTO.quantidade,
          unidade: itemDTO.unidade,
          valorUnitario: itemDTO.valorUnitario,
          createdBy: membership.user.id,
          updatedBy: membership.user.id,
          organizationId: membership.organization.id,
        }
      }
      return {
        id: itemDTO.id || undefined,
        insumo: {
          id: itemDTO.insumoId,
        },
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
        updatedBy: membership.user.id,
      }
    }),
    updatedBy: membership.user.id,
  })

  const updatedRequisicaoEstoque = repository.requisicaoEstoque.merge(
    { id: requisicaoToUpdate.id } as RequisicaoEstoque,
    requisicaoDto,
  )

  return await manager.save(RequisicaoEstoque, updatedRequisicaoEstoque)
}

async function processarNovasMovimentacoes(
  requisicao: RequisicaoEstoque,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of requisicao.itens) {
    await registrarSaidaEstoqueUseCase.execute(
      {
        insumo: item.insumo,
        armazem: requisicao.armazem,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        undEstoque: item.unidade,
        documentoOrigemId: requisicao.id,
        observacao: '',
        tipoDocumento: 'REQUISICAO-ESTOQUE',
        data: requisicao.dataRequisicao,
      },
      membership,
      manager,
    )
  }
}
