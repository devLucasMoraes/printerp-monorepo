import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Armazem } from './Armazem'
import { BaseAuditEntity } from './BaseAuditEntity'
import { EmprestimoItem } from './EmprestimoItem'
import { Parceiro } from './Parceiro'

@Entity('emprestimos')
export class Emprestimo extends BaseAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'data_emprestimo', type: 'timestamp' })
  dataEmprestimo: Date

  @Column({ name: 'previsao_devolucao', type: 'timestamp', nullable: true })
  previsaoDevolucao: Date | null

  @Column({
    name: 'custo_estimado',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  custoEstimado: number

  @Column({ type: 'varchar', length: 255 })
  tipo: 'ENTRADA' | 'SAIDA'

  @Column({ type: 'varchar', length: 255, default: 'EM ABERTO' })
  status: 'EM_ABERTO' | 'FECHADO'

  @Column({ type: 'varchar', length: 255, nullable: true })
  obs: string | null

  @ManyToOne(() => Armazem)
  @JoinColumn({ name: 'armazem_id' })
  armazem: Armazem

  @ManyToOne(() => Parceiro)
  @JoinColumn({ name: 'parceiro_id' })
  parceiro: Parceiro

  @OneToMany(
    () => EmprestimoItem,
    (emprestimoItem) => emprestimoItem.emprestimo,
    { cascade: true },
  )
  itens: EmprestimoItem[]
}
