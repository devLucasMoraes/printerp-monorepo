import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Armazem } from './Armazem'
import { BaseAuditEntity } from './BaseAuditEntity'
import { RequisicaoEstoqueItem } from './RequisicaoEstoqueItem'
import { Requisitante } from './Requisitante'
import { Setor } from './Setor'

@Entity('requisicoes_estoque')
export class RequisicaoEstoque extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'data_requisicao', type: 'timestamp' })
  dataRequisicao: Date

  @Column({ name: 'valor_total', type: 'numeric', precision: 10, scale: 2 })
  valorTotal: number

  @Column({
    name: 'ordem_producao',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  ordemProducao: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  obs: string | null

  @ManyToOne(() => Requisitante)
  @JoinColumn({ name: 'requisitante' })
  requisitante: Requisitante

  @ManyToOne(() => Setor)
  @JoinColumn({ name: 'setor' })
  setor: Setor

  @ManyToOne(() => Armazem)
  @JoinColumn({ name: 'armazem' })
  armazem: Armazem

  @OneToMany(
    () => RequisicaoEstoqueItem,
    (requisicaoEstoqueItem) => requisicaoEstoqueItem.requisicaoEstoque,
    { cascade: true },
  )
  itens: RequisicaoEstoqueItem[]
}
