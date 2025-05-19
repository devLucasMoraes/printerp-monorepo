import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Categoria } from './Categoria'
import { Estoque } from './Estoque'
import { MovimentoEstoque } from './MovimentoEstoque'
import { Unidade } from './Unidade'

@Entity('insumos')
@Unique(['descricao', 'organizationId'])
export class Insumo extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  descricao: string

  @Column({
    name: 'valor_unt_med',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  valorUntMed: number

  @Column({ name: 'valor_unt_med_auto', type: 'boolean', default: false })
  valorUntMedAuto = false

  @Column({ name: 'permite_estoque_negativo', type: 'boolean', default: false })
  permiteEstoqueNegativo = false

  @Column({
    name: 'und_estoque',
    type: 'enum',
    enum: Unidade,
  })
  undEstoque: Unidade

  @Column({
    name: 'estoque_minimo',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  estoqueMinimo: number

  @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria

  @OneToMany(() => Estoque, (estoque) => estoque.insumo)
  estoques: Estoque[]

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.insumo)
  movimentos: MovimentoEstoque[]

  getSaldoTotal(): number {
    return this.estoques.reduce(
      (total, estoque) => total + estoque.quantidade,
      0,
    )
  }

  public getValorTotal() {
    const saldo = this.getSaldoTotal()
    return saldo * this.valorUntMed
  }

  estaAbaixoDoMinimo(): boolean {
    return this.getSaldoTotal() < this.estoqueMinimo
  }
}
