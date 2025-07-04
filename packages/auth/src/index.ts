import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { armazemSubject } from './subjects/armazem'
import { billingSubject } from './subjects/billing'
import { categoriaSubject } from './subjects/categoria'
import { chartSubject } from './subjects/chart'
import { emprestimoSubject } from './subjects/emprestimo'
import { estoqueSubject } from './subjects/estoque'
import { fornecedoraSubject } from './subjects/fornecedora'
import { insumoSubject } from './subjects/insumo'
import { nfeCompraSubject } from './subjects/nfe-compra'
import { organizationSubject } from './subjects/organization'
import { parceiroSubject } from './subjects/parceiro'
import { requisicaoEstoqueSubject } from './subjects/requisicao-estoque'
import { requisitanteSubject } from './subjects/requisitante'
import { setorSubject } from './subjects/setor'
import { transportadoraSubject } from './subjects/transportadora'
import { userSubject } from './subjects/user'
import { vinculoSubject } from './subjects/vinculo'

export * from './models/categoria'
export * from './models/organization'
export * from './models/user'
export * from './roles'

const appAbility = z.union([
  categoriaSubject,
  userSubject,
  billingSubject,
  organizationSubject,
  insumoSubject,
  setorSubject,
  requisitanteSubject,
  armazemSubject,
  estoqueSubject,
  parceiroSubject,
  requisicaoEstoqueSubject,
  emprestimoSubject,
  chartSubject,
  fornecedoraSubject,
  transportadoraSubject,
  nfeCompraSubject,
  vinculoSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbility>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType: (subject) => subject.__typename,
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
