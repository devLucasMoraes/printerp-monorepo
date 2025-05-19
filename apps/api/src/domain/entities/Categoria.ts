import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Insumo } from './Insumo'

@Entity('categorias')
@Unique(['nome', 'organizationId'])
export class Categoria extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nome: string

  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[]
}
