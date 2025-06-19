import { Account } from './Account'
import { Armazem } from './Armazem'
import { BaseAuditEntity } from './BaseAuditEntity'
import { Categoria } from './Categoria'
import { DevolucaoItem } from './DevolucaoItem'
import { Emprestimo } from './Emprestimo'
import { EmprestimoItem } from './EmprestimoItem'
import { Estoque } from './Estoque'
import { Fornecedora } from './Fornecedora'
import { Insumo } from './Insumo'
import { Member } from './Member'
import { MovimentoEstoque } from './MovimentoEstoque'
import { NfeCompra } from './NfeCompra'
import { NfeCompraItem } from './NfeCompraItem'
import { Organization } from './Organization'
import { Parceiro } from './Parceiro'
import { RequisicaoEstoque } from './RequisicaoEstoque'
import { RequisicaoEstoqueItem } from './RequisicaoEstoqueItem'
import { Requisitante } from './Requisitante'
import { Setor } from './Setor'
import { Setting } from './Setting'
import { Token } from './Token'
import { Transportadora } from './Transportadora'
import { User } from './User'
import { Vinculo } from './Vinculo'

export const entities = [
  BaseAuditEntity,
  Fornecedora,
  Vinculo,
  Insumo,
  Account,
  Armazem,
  Categoria,
  DevolucaoItem,
  EmprestimoItem,
  Emprestimo,
  Estoque,
  Member,
  MovimentoEstoque,
  NfeCompra,
  NfeCompraItem,
  Organization,
  Parceiro,
  RequisicaoEstoque,
  RequisicaoEstoqueItem,
  Requisitante,
  Setor,
  Setting,
  Token,
  Transportadora,
  User,
]
