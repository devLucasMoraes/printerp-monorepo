import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Vinculo } from './Vinculo'

@Entity('fornecedoras')
@Unique(['cnpj', 'organizationId'])
export class Fornecedora extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, name: 'nome_fantasia' })
  nomeFantasia: string

  @Column({ type: 'varchar', length: 255, name: 'razao_social' })
  razaoSocial: string

  @Column({ type: 'varchar', length: 255 })
  cnpj: string

  @Column({ type: 'varchar', length: 255 })
  fone: string

  @OneToMany(() => Vinculo, (vinculo) => vinculo.fornecedora)
  vinculos: Vinculo[]
}
