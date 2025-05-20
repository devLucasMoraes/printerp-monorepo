import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Emprestimo } from './Emprestimo'

@Entity('parceiros')
@Unique(['nome', 'organizationId'])
export class Parceiro extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nome: string

  @Column({ type: 'varchar', length: 255 })
  fone: string

  @OneToMany(() => Emprestimo, (emprestimo) => emprestimo.parceiro)
  emprestimos: Emprestimo[]
}
