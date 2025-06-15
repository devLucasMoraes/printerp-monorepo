import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { NfeCompra } from './NfeCompra'
import { Unidade } from './Unidade'
import { Vinculo } from './Vinculo'

@Entity('nfe_compra_itens')
export class NfeCompraItem extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'qtde_nf', type: 'numeric', precision: 10, scale: 2 })
  qtdeNf: number

  @Column({
    name: 'unidade_nf',
    type: 'enum',
    enum: Unidade,
  })
  unidadeNf: Unidade

  @Column({ name: 'valor_unitario', type: 'numeric', precision: 10, scale: 2 })
  valorUnitario: number

  @Column({ name: 'valor_ipi', type: 'numeric', precision: 10, scale: 2 })
  valorIpi: number

  @Column({ type: 'varchar', length: 255, name: 'descricao_fornecedora' })
  descricaoFornecedora: string

  @Column({ type: 'varchar', length: 255, name: 'cod_fornecedora' })
  codFornecedora: string

  @ManyToOne(() => Vinculo)
  @JoinColumn({ name: 'vinculo' })
  vinculo: Vinculo

  @ManyToOne(() => NfeCompra, (nfeCompra) => nfeCompra.itens, {
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn({ name: 'nfe_compra' })
  nfeCompra: NfeCompra
}
