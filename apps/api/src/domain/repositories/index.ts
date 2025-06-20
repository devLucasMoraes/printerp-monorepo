import { ArmazemRepository } from './ArmazemRepository'
import { CategoriaRepository } from './CategoriaRepository'
import { EmprestimoRepository } from './EmprestimoRepository'
import { EstoqueRepository } from './EstoqueRepository'
import { FornecedoraRepository } from './FornecedoraRepository'
import { InsumoRepository } from './InsumoRepository'
import { MemberRepository } from './MemberRepository'
import { MovimentoEstoqueRepository } from './MovimentoEstoqueRepository'
import { NfeCompraRepository } from './NfeCompraRepository'
import { OrganizationRepository } from './OrganizationRepository'
import { ParceiroRepository } from './ParceiroRepository'
import { RequisicaoEstoqueRepository } from './RequisicaoEstoqueRepository'
import { RequisitanteRepository } from './RequisitanteRepository'
import { SetorRepository } from './SetorRepository'
import { TokenRepository } from './TokenRepository'
import { TransportadoraRepository } from './TransportadoraRepository'
import { UserRepository } from './UserRepository'
import { VinculoRepository } from './VinculoRepository'

const user = new UserRepository()
const categoria = new CategoriaRepository()
const setor = new SetorRepository()
const requisicaoEstoque = new RequisicaoEstoqueRepository()
const requisitante = new RequisitanteRepository()
const insumo = new InsumoRepository()
const armazem = new ArmazemRepository()
const estoque = new EstoqueRepository()
const movimentoEstoque = new MovimentoEstoqueRepository()
const emprestimo = new EmprestimoRepository()
const parceiro = new ParceiroRepository()
const organization = new OrganizationRepository()
const member = new MemberRepository()
const token = new TokenRepository()
const fornecedora = new FornecedoraRepository()
const transportadora = new TransportadoraRepository()
const nfeCompra = new NfeCompraRepository()
const vinculo = new VinculoRepository()

export const repository = {
  user,
  categoria,
  setor,
  requisicaoEstoque,
  requisitante,
  insumo,
  armazem,
  estoque,
  movimentoEstoque,
  emprestimo,
  parceiro,
  organization,
  member,
  token,
  fornecedora,
  transportadora,
  nfeCompra,
  vinculo,
}
