import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Armazem } from './Armazem'
import { BaseAuditEntity } from './BaseAuditEntity'
import { Fornecedora } from './Fornecedora'
import { NfeCompraItem } from './NfeCompraItem'
import { Transportadora } from './Transportadora'

@Entity('nfes_compra')
@Unique(['nfe', 'chaveNfe', 'organizationId'])
export class NfeCompra extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, name: 'nfe' })
  nfe!: string

  @Column({ type: 'varchar', length: 255, name: 'chave_nfe' })
  chaveNfe!: string

  @Column({ type: 'timestamp', name: 'data_emissao' })
  dataEmissao!: Date

  @Column({ type: 'timestamp', name: 'data_recebimento' })
  dataRecebimento!: Date

  @Column({
    name: 'valor_total_produtos',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorTotalProdutos!: number

  @Column({
    name: 'valor_frete',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorFrete!: number

  @Column({
    name: 'valor_total_ipi',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorTotalIpi!: number

  @Column({
    name: 'valor_seguro',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorSeguro!: number

  @Column({
    name: 'valor_desconto',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorDesconto!: number

  @Column({
    name: 'valor_total_nfe',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorTotalNfe!: number

  @Column({
    name: 'valor_outros',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorOutros!: number

  @Column({ type: 'varchar', length: 255, name: 'observacao', nullable: true })
  observacao!: string | null

  @Column({
    name: 'add_estoque',
    type: 'boolean',
    default: true,
  })
  addEstoque!: boolean

  @ManyToOne(() => Armazem, {
    nullable: true,
  })
  @JoinColumn({ name: 'armazem' })
  armazem!: Armazem | null

  @ManyToOne(() => Fornecedora)
  @JoinColumn({ name: 'fornecedora' })
  fornecedora!: Fornecedora

  @ManyToOne(() => Transportadora)
  @JoinColumn({ name: 'transportadora' })
  transportadora!: Transportadora

  @OneToMany(() => NfeCompraItem, (nfeCompraItem) => nfeCompraItem.nfeCompra, {
    cascade: true,
  })
  itens!: NfeCompraItem[]
}
