import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Armazem } from './Armazem'
import { BaseAuditEntity } from './BaseAuditEntity'
import { Insumo } from './Insumo'
import { Unidade } from './Unidade'

@Entity('movimentos_estoque')
export class MovimentoEstoque extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA'

  @Column({ type: 'timestamp' })
  data: Date

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  quantidade: number

  @Column({ name: 'valor_unitario', type: 'numeric', precision: 10, scale: 2 })
  valorUnitario: number

  @Column({
    name: 'unidade',
    type: 'enum',
    enum: Unidade,
  })
  unidade: Unidade

  @Column({ name: 'documento_origem_id', type: 'uuid' })
  documentoOrigemId: string

  @Column({ name: 'tipo_documento', type: 'varchar', length: 50 })
  tipoDocumento: string

  @Column({ type: 'boolean', default: false })
  estorno: boolean

  @Column({ type: 'varchar', length: 255, nullable: true })
  observacao: string | null

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosSaida, {
    nullable: true,
  })
  @JoinColumn({ name: 'armazem_origem' })
  armazemOrigem: Armazem | null

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosEntrada, {
    nullable: true,
  })
  @JoinColumn({ name: 'armazem_destino' })
  armazemDestino: Armazem | null

  @ManyToOne(() => Insumo, (insumo) => insumo.movimentos)
  @JoinColumn({ name: 'insumo' })
  insumo: Insumo
}
