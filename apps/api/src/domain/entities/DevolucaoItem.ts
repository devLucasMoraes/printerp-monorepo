import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { EmprestimoItem } from './EmprestimoItem'
import { Insumo } from './Insumo'
import { Unidade } from './Unidade'

@Entity('devolucao_itens')
export class DevolucaoItem extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'data_devolucao', type: 'timestamp' })
  dataDevolucao: Date

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantidade: number

  @Column({
    name: 'unidade',
    type: 'enum',
    enum: Unidade,
  })
  unidade: Unidade

  @Column({ name: 'valor_unitario', type: 'numeric', precision: 10, scale: 2 })
  valorUnitario: number

  @ManyToOne(() => Insumo)
  @JoinColumn({ name: 'insumo' })
  insumo: Insumo

  @ManyToOne(() => EmprestimoItem, (emprestimo) => emprestimo.devolucaoItens, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'emprestimo_item' })
  emprestimoItem: EmprestimoItem
}
