import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Insumo } from './Insumo'
import { NfeDeCompra } from './NfeDeCompra'
import { Unidade } from './Unidade'

@Entity('nfes_de_compra_itens')
export class NfeDeCompraItem extends BaseAuditEntity {
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

  @Column({ name: 'valor_ipi', type: 'numeric', precision: 10, scale: 2 })
  valorIpi: number

  @Column({ type: 'varchar', length: 255, name: 'descricao_fornecedora' })
  descricaoFornecedora: string

  @Column({ type: 'varchar', length: 255, name: 'referencia_fornecedora' })
  referenciaFornecedora: string

  @ManyToOne(() => Insumo)
  @JoinColumn({ name: 'insumo' })
  insumo: Insumo

  @ManyToOne(() => NfeDeCompra, (nfeDeCompra) => nfeDeCompra.itens, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'nfe_de_compra' })
  nfeDeCompra: NfeDeCompra
}
