import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { RequisicaoEstoque } from './RequisicaoEstoque'

@Entity('setores')
@Unique(['nome', 'organizationId'])
export class Setor extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nome: string

  @OneToMany(
    () => RequisicaoEstoque,
    (requisicaoEstoque) => requisicaoEstoque.requisitante,
  )
  requisicoes: RequisicaoEstoque[]
}
