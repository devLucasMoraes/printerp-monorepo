import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { DevolucaoItem } from './DevolucaoItem'
import { Emprestimo } from './Emprestimo'
import { Insumo } from './Insumo'
import { Unidade } from './Unidade'

@Entity('emprestimo_itens')
export class EmprestimoItem extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

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

  @ManyToOne(() => Emprestimo, (emprestimo) => emprestimo.itens, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'emprestimo' })
  emprestimo: Emprestimo

  @OneToMany(
    () => DevolucaoItem,
    (devolucaoItem) => devolucaoItem.emprestimoItem,
    { cascade: true },
  )
  devolucaoItens: DevolucaoItem[]
}
