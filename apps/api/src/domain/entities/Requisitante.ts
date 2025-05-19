import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { RequisicaoEstoque } from './RequisicaoEstoque'

@Entity('requisitantes')
@Unique(['nome', 'organizationId'])
export class Requisitante extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nome: string

  @Column({ type: 'varchar', length: 255 })
  fone: string

  @OneToMany(
    () => RequisicaoEstoque,
    (requisicaoEstoque) => requisicaoEstoque.requisitante,
  )
  requisicoes: RequisicaoEstoque[]
}
