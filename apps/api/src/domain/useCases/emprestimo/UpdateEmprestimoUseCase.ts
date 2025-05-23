import { EntityManager } from 'typeorm'

import { Member } from '@/domain/entities/Member'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateEmprestimoDTO } from '@/http/routes/emprestimo/update-requisicao-estoque'

import { Armazem } from '../../entities/Armazem'
import { Emprestimo } from '../../entities/Emprestimo'
import { Insumo } from '../../entities/Insumo'
import { Parceiro } from '../../entities/Parceiro'
import { registrarEntradaEstoqueUseCase } from '../estoque/RegistrarEntradaEstoqueUseCase'
import { registrarSaidaEstoqueUseCase } from '../estoque/RegistrarSaidaEstoqueUseCase'

export const updateEmprestimoUseCase = {
  async execute(
    id: string,
    dto: UpdateEmprestimoDTO,
    membership: Member,
  ): Promise<Emprestimo> {
    return await repository.emprestimo.manager.transaction(async (manager) => {
      const emprestimoToUpdate = await findEmprestimoToUpdate(
        id,
        membership,
        manager,
      )
      await validate(emprestimoToUpdate, dto, membership, manager)
      await reverterMovimentacoes(emprestimoToUpdate, membership, manager)
      const emprestimoAtualizada = await updateEmprestimo(
        emprestimoToUpdate,
        dto,
        manager,
      )
      await processarNovasMovimentacoes(
        emprestimoAtualizada,
        membership,
        manager,
      )

      return emprestimoAtualizada
    })
  },
}

async function findEmprestimoToUpdate(
  id: string,
  membership: Member,
  manager: EntityManager,
): Promise<Emprestimo> {
  const emprestimo = await manager.findOne(Emprestimo, {
    where: { id, organizationId: membership.organization.id },
    relations: {
      parceiro: true,
      armazem: true,
      itens: {
        insumo: true,
        devolucaoItens: {
          insumo: true,
        },
      },
    },
  })

  if (!emprestimo) {
    throw new BadRequestError('Empréstimo not found')
  }

  return emprestimo
}

async function validate(
  emprestimoToUpdate: Emprestimo,
  emprestimoDTO: UpdateEmprestimoDTO,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  const parceiro = await manager.findOne(Parceiro, {
    where: {
      id: emprestimoDTO.parceiroId,
      organizationId: membership.organization.id,
    },
  })

  if (!parceiro) {
    throw new BadRequestError('Parceiro não encontrado')
  }

  const armazem = await manager.findOne(Armazem, {
    where: {
      id: emprestimoDTO.armazemId,
      organizationId: membership.organization.id,
    },
  })

  if (!armazem) {
    throw new BadRequestError('Armazém não encontrado')
  }

  if (emprestimoDTO.itens.length === 0) {
    throw new BadRequestError('Empréstimo deve ter pelo menos um item')
  }

  for (const itemDTO of emprestimoDTO.itens) {
    if (itemDTO.id !== null) {
      const itemPertence = emprestimoToUpdate.itens.some(
        (itemExistente) => itemExistente.id === itemDTO.id,
      )

      if (!itemPertence) {
        throw new BadRequestError(
          `Não é possível atualizar o item de outro empréstimo`,
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
      throw new BadRequestError('Insumo não encontrado')
    }
    if (itemDTO.quantidade <= 0) {
      throw new BadRequestError('Quantidade deve ser maior que zero')
    }
    if (itemDTO.unidade !== insumo.undEstoque) {
      throw new BadRequestError('Unidade deve ser igual a unidade do estoque')
    }

    if (itemDTO.devolucaoItens.length) {
      for (const devolucaoItem of itemDTO.devolucaoItens) {
        const insumo = await manager.findOne(Insumo, {
          where: { id: devolucaoItem.insumoId },
        })
        if (!insumo) {
          throw new BadRequestError('Insumo não encontrado')
        }
        if (itemDTO.quantidade <= 0) {
          throw new BadRequestError('Quantidade deve ser maior que zero')
        }
        if (itemDTO.unidade !== insumo.undEstoque) {
          throw new BadRequestError(
            'Unidade deve ser igual a unidade do estoque',
          )
        }
      }
    }
  }
}

async function reverterMovimentacoes(
  emprestimoToUpdate: Emprestimo,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of emprestimoToUpdate.itens) {
    for (const devolucaoItem of item.devolucaoItens) {
      const params = {
        insumo: devolucaoItem.insumo,
        armazem: emprestimoToUpdate.armazem,
        quantidade: devolucaoItem.quantidade,
        valorUnitario: devolucaoItem.valorUnitario,
        undEstoque: devolucaoItem.unidade,
        documentoOrigemId: emprestimoToUpdate.id,
        observacao: 'Movimentação gerada por atualização de emprestimo',
        data: emprestimoToUpdate.dataEmprestimo,
        estorno: true,
      }

      if (emprestimoToUpdate.tipo === 'SAIDA') {
        await registrarSaidaEstoqueUseCase.execute(
          { ...params, tipoDocumento: 'EMPRESTIMO' },
          membership,
          manager,
        )
      }

      if (emprestimoToUpdate.tipo === 'ENTRADA') {
        await registrarEntradaEstoqueUseCase.execute(
          { ...params, tipoDocumento: 'EMPRESTIMO' },
          membership,
          manager,
        )
      }
    }

    const params = {
      insumo: item.insumo,
      armazem: emprestimoToUpdate.armazem,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      undEstoque: item.unidade,
      documentoOrigemId: emprestimoToUpdate.id,
      observacao: 'Movimentação gerada por atualização de emprestimo',
      data: emprestimoToUpdate.dataEmprestimo,
      estorno: true,
    }

    if (emprestimoToUpdate.tipo === 'SAIDA') {
      await registrarEntradaEstoqueUseCase.execute(
        { ...params, tipoDocumento: 'EMPRESTIMO' },
        membership,
        manager,
      )
    }

    if (emprestimoToUpdate.tipo === 'ENTRADA') {
      await registrarSaidaEstoqueUseCase.execute(
        { ...params, tipoDocumento: 'EMPRESTIMO' },
        membership,
        manager,
      )
    }
  }
}

async function updateEmprestimo(
  emprestimoToUpdate: Emprestimo,
  dto: UpdateEmprestimoDTO,
  manager: EntityManager,
): Promise<Emprestimo> {
  const emprestimoDto = repository.emprestimo.create({
    tipo: dto.tipo,
    status: dto.status,
    dataEmprestimo: dto.dataEmprestimo,
    previsaoDevolucao: dto.previsaoDevolucao,
    custoEstimado: dto.custoEstimado,
    parceiro: { id: dto.parceiroId },
    armazem: { id: dto.armazemId },
    obs: dto.obs,
    itens: dto.itens.map((itemDTO) => {
      return {
        id: itemDTO.id || undefined,
        insumo: { id: itemDTO.insumoId },
        quantidade: itemDTO.quantidade,
        unidade: itemDTO.unidade,
        valorUnitario: itemDTO.valorUnitario,
        devolucaoItens: itemDTO.devolucaoItens.map((devolucaoItem) => {
          return {
            id: devolucaoItem.id || undefined,
            insumo: { id: devolucaoItem.insumoId },
            quantidade: devolucaoItem.quantidade,
            unidade: devolucaoItem.unidade,
            valorUnitario: devolucaoItem.valorUnitario,
            dataDevolucao: devolucaoItem.dataDevolucao,
          }
        }),
      }
    }),
  })

  const { ...emprestimoWithoutRelations } = emprestimoToUpdate

  const updatedEmprestimo = repository.emprestimo.merge(
    emprestimoWithoutRelations as Emprestimo,
    emprestimoDto,
  )

  return await manager.save(Emprestimo, updatedEmprestimo)
}

async function processarNovasMovimentacoes(
  emprestimo: Emprestimo,
  membership: Member,
  manager: EntityManager,
): Promise<void> {
  for (const item of emprestimo.itens) {
    for (const devolucaoItem of item.devolucaoItens) {
      const params = {
        insumo: devolucaoItem.insumo,
        armazem: emprestimo.armazem,
        quantidade: devolucaoItem.quantidade,
        valorUnitario: devolucaoItem.valorUnitario,
        undEstoque: devolucaoItem.unidade,
        documentoOrigemId: emprestimo.id,
        observacao: '',
        data: emprestimo.dataEmprestimo,
      }

      if (emprestimo.tipo === 'SAIDA') {
        await registrarEntradaEstoqueUseCase.execute(
          { ...params, tipoDocumento: 'EMPRESTIMO' },
          membership,
          manager,
        )
      }

      if (emprestimo.tipo === 'ENTRADA') {
        await registrarSaidaEstoqueUseCase.execute(
          { ...params, tipoDocumento: 'EMPRESTIMO' },
          membership,
          manager,
        )
      }
    }

    const params = {
      insumo: item.insumo,
      armazem: emprestimo.armazem,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      undEstoque: item.unidade,
      documentoOrigemId: emprestimo.id,
      observacao: '',
      data: emprestimo.dataEmprestimo,
    }

    if (emprestimo.tipo === 'SAIDA') {
      await registrarSaidaEstoqueUseCase.execute(
        { ...params, tipoDocumento: 'EMPRESTIMO' },
        membership,
        manager,
      )
    }

    if (emprestimo.tipo === 'ENTRADA') {
      await registrarEntradaEstoqueUseCase.execute(
        { ...params, tipoDocumento: 'EMPRESTIMO' },
        membership,
        manager,
      )
    }
  }
}
