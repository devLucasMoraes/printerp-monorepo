import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Insumo } from './Insumo'
import { RequisicaoEstoque } from './RequisicaoEstoque'
import { Unidade } from './Unidade'

@Entity('requisicoes_estoque_itens')
export class RequisicaoEstoqueItem extends BaseAuditEntity {
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

  @ManyToOne(() => Insumo, (insumo) => insumo.id)
  @JoinColumn({ name: 'insumos_id' })
  insumo: Insumo

  @ManyToOne(
    () => RequisicaoEstoque,
    (requisicaoEstoque) => requisicaoEstoque.itens,
    { orphanedRowAction: 'soft-delete' },
  )
  @JoinColumn({ name: 'requisicoes_estoque_id' })
  requisicaoEstoque: RequisicaoEstoque

  public getValorTotal() {
    return this.quantidade * this.valorUnitario
  }
}
