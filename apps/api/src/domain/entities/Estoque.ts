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
  @JoinColumn({ name: 'armazem_id' })
  armazem: Armazem

  @ManyToOne(() => Insumo, (insumo) => insumo.estoques)
  @JoinColumn({ name: 'insumo_id' })
  insumo: Insumo

  @AfterLoad()
  recalcularEstaAbaixoMinimo() {
    if (this.insumo?.estoqueMinimo !== undefined) {
      this.abaixoMinimo =
        Number(this.quantidade) < Number(this.insumo.estoqueMinimo)
    }
  }

  possuiQuantidadeSuficiente(quantidadeDesejada: number): boolean {
    return this.quantidade >= quantidadeDesejada
  }

  calcularDiasRestantes(): number | null {
    if (!this.consumoMedioDiario || this.consumoMedioDiario <= 0) {
      return null
    }
    return Math.floor(this.quantidade / this.consumoMedioDiario)
  }

  calcularPrevisaoFimEstoque(): Date | null {
    const diasRestantes = this.calcularDiasRestantes()
    if (diasRestantes === null) {
      return null
    }

    const dataPrevisao = new Date()
    dataPrevisao.setDate(dataPrevisao.getDate() + diasRestantes)
    return dataPrevisao
  }

  calcularPrevisaoEstoqueMinimo(): Date | null {
    if (!this.consumoMedioDiario || this.consumoMedioDiario <= 0) {
      return null
    }

    const diasAteEstoqueMinimo = Math.floor(
      (this.quantidade - this.insumo.estoqueMinimo) / this.consumoMedioDiario,
    )
    if (diasAteEstoqueMinimo < 0) {
      return null // Já está abaixo do mínimo
    }

    const dataPrevisao = new Date()
    dataPrevisao.setDate(dataPrevisao.getDate() + diasAteEstoqueMinimo)
    return dataPrevisao
  }
}
