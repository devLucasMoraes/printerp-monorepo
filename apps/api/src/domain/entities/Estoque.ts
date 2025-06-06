import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Armazem } from './Armazem'
import { BaseAuditEntity } from './BaseAuditEntity'
import { Insumo } from './Insumo'

@Entity('estoques')
export class Estoque extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  quantidade: number

  @Column({
    name: 'consumo_medio_diario',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  consumoMedioDiario: number | null

  @Column({
    name: 'ultima_atualizacao_consumo',
    type: 'timestamp',
    nullable: true,
  })
  ultimaAtualizacaoConsumo: Date | null

  @Column({
    name: 'abaixo_minimo',
    type: 'boolean',
    default: false,
  })
  abaixoMinimo: boolean

  @ManyToOne(() => Armazem, (armazem) => armazem.estoques)
  @JoinColumn({ name: 'armazem' })
  armazem: Armazem

  @ManyToOne(() => Insumo, (insumo) => insumo.estoques)
  @JoinColumn({ name: 'insumo' })
  insumo: Insumo

  @AfterLoad()
  recalcularEstaAbaixoMinimo() {
    if (this.insumo?.estoqueMinimo !== undefined) {
      this.abaixoMinimo =
        Number(this.quantidade) < Number(this.insumo.estoqueMinimo)
    }
  }
}
