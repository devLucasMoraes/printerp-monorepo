import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { Insumo } from './Insumo'

@Entity('categorias')
@Unique(['nome', 'organizationId'])
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nome: string

  @Column({ type: 'boolean', default: true })
  ativo: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ type: 'uuid', name: 'updated_by' })
  updatedBy: string

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  @Column({ type: 'uuid', name: 'deleted_by', nullable: true })
  deletedBy: string | null

  @Column({ type: 'uuid', name: 'organization_id' })
  organizationId: string

  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[]
}
