import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateEmprestimoDTO } from '@/http/routes/emprestimo/create-emprestimo'

import { Armazem } from '../../entities/Armazem'
import { Emprestimo } from '../../entities/Emprestimo'
import { Insumo } from '../../entities/Insumo'
import { Parceiro } from '../../entities/Parceiro'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const createEmprestimoUseCase = {
  async execute(
    dto: CreateEmprestimoDTO,
    membership: Member,
  ): Promise<Emprestimo> {
    return await repository.emprestimo.manager.transaction(async (manager) => {
      await validate(dto, membership, manager)
      const emprestimo = await createEmprestimo(dto, membership, manager)
      await processarMovimentacoes(emprestimo, membership, manager)
      return emprestimo
    })
  },
}

async function validate(
  dto: CreateEmprestimoDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const parceiro = await manager.findOne(Parceiro, {
    where: { id: dto.parceiroId, organizationId: membership.organization.id },
  })

  if (!parceiro) {
    throw new BadRequestError('Parceiro não encontrado')
  }

  const armazem = await manager.findOne(Armazem, {
    where: { id: dto.armazemId, organizationId: membership.organization.id },
  })

  if (!armazem) {
    throw new BadRequestError('Armazém não encontrado')
  }

  if (dto.itens.length === 0) {
    throw new BadRequestError('Empréstimo deve ter pelo menos um item')
  }

  for (const item of dto.itens) {
    const insumo = await manager.findOne(Insumo, {
      where: { id: item.insumoId, organizationId: membership.organization.id },
    })
    if (!insumo) {
      throw new BadRequestError('Insumo não encontrado')
    }

    if (item.quantidade <= 0) {
      throw new BadRequestError('Quantidade deve ser maior que zero')
    }

    if (item.unidade !== insumo.undEstoque) {
      throw new BadRequestError('Unidade deve ser igual a unidade do estoque')
    }
  }
}

async function createEmprestimo(
  dto: CreateEmprestimoDTO,
  membership: Member,
  manager: EntityManager,
): Promise<Emprestimo> {
  const emprestimoToCreate = repository.emprestimo.create({
    tipo: dto.tipo,
    status: dto.status,
    dataEmprestimo: dto.dataEmprestimo,
    previsaoDevolucao: dto.previsaoDevolucao,
    custoEstimado: dto.custoEstimado,
    parceiro: { id: dto.parceiroId },
    armazem: { id: dto.armazemId },
    obs: dto.obs,
    createdBy: membership.user.id,
    updatedBy: membership.user.id,
    organizationId: membership.organization.id,
    itens: dto.itens.map((itemDTO) => {
      return {
        insumo: { id: itemDTO.insumoId },
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
        organizationId: membership.organization.id,
      }
    }),
  })

  return await manager.save(Emprestimo, emprestimoToCreate)
}

async function processarMovimentacoes(
  emprestimo: Emprestimo,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of emprestimo.itens) {
    if (emprestimo.tipo === 'ENTRADA') {
      await registrarEntradaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: emprestimo.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.unidade,
          documentoOrigemId: emprestimo.id,
          tipoDocumento: 'EMPRESTIMO',
          data: emprestimo.dataEmprestimo,
        },
        membership,
        manager,
      )
    }
    if (emprestimo.tipo === 'SAIDA') {
      await registrarSaidaEstoqueUseCase.execute(
        {
          insumo: item.insumo,
          armazem: emprestimo.armazem,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          undEstoque: item.unidade,
          documentoOrigemId: emprestimo.id,
          tipoDocumento: 'EMPRESTIMO',
          data: emprestimo.dataEmprestimo,
        },
        membership,
        manager,
      )
    }
  }
}
