import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'

@Entity('transportadoras')
export class Transportadora extends BaseAuditEntity {
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
}
