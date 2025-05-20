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
    name: 'undidade',
    type: 'enum',
    enum: Unidade,
  })
  undidade: Unidade

  @Column({ name: 'documento_origem_id', type: 'uuid' })
  documentoOrigemId: string

  @Column({ name: 'tipo_documento', type: 'varchar', length: 50 })
  tipoDocumento: string

  @Column({ type: 'boolean', default: false })
  estorno: boolean

  @Column({ type: 'text', nullable: true })
  observacao?: string

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosSaida)
  @JoinColumn({ name: 'armazem_origem_id' })
  armazemOrigem: Armazem

  @ManyToOne(() => Armazem, (armazem) => armazem.movimentosEntrada)
  @JoinColumn({ name: 'armazem_destino_id' })
  armazemDestino: Armazem

  @ManyToOne(() => Insumo, (insumo) => insumo.movimentos)
  @JoinColumn({ name: 'insumo_id' })
  insumo: Insumo
}
