import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { BaseAuditEntity } from './BaseAuditEntity'
import { Estoque } from './Estoque'
import { MovimentoEstoque } from './MovimentoEstoque'

@Entity('armazens')
@Unique(['nome', 'organizationId'])
export class Armazem extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  nome: string

  @OneToMany(() => Estoque, (estoque) => estoque.armazem)
  estoques: Estoque[]

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.armazemOrigem)
  movimentosSaida: MovimentoEstoque[]

  @OneToMany(() => MovimentoEstoque, (movimento) => movimento.armazemDestino)
  movimentosEntrada: MovimentoEstoque[]
}
