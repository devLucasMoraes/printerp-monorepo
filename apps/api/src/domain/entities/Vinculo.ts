import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Fornecedora } from './Fornecedora'
import { Insumo } from './Insumo'
import { Unidade } from './Unidade'

@Entity('vinculos')
@Unique(['cod', 'insumoId', 'fornecedoraId', 'undCompra', 'organizationId'])
export class Vinculo extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'cod', type: 'varchar', length: 255 })
  cod: string

  @Column({
    name: 'und_compra',
    type: 'enum',
    enum: Unidade,
  })
  undCompra: Unidade

  @Column({
    name: 'possui_conversao',
    type: 'boolean',
    default: false,
  })
  possuiConversao: boolean

  @Column({
    name: 'qtde_embabalagem',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  qtdeEmbalagem: number | null

  @Column({ type: 'uuid', name: 'insumo_id' })
  insumoId: string

  @Column({ type: 'uuid', name: 'fornecedora_id' })
  fornecedoraId: string

  @ManyToOne(() => Fornecedora, (fornecedora) => fornecedora.vinculos)
  @JoinColumn({ name: 'fornecedora' })
  fornecedora: Fornecedora

  @ManyToOne(() => Insumo, (insumo) => insumo.vinculos)
  @JoinColumn({ name: 'insumo' })
  insumo: Insumo
}
