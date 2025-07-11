import {
  IconAffiliate,
  IconBinaryTree,
  IconBox,
  IconBuildingFactory2,
  IconBuildingWarehouse,
  IconCategoryPlus,
  IconChecklist,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconNotes,
  IconPackages,
  IconReplaceUser,
  IconSettings,
  IconTruck,
  IconUsers,
  IconUserUp,
} from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uuidv4(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uuidv4(),
    title: 'Fornecedoras',
    icon: IconBuildingFactory2,
    href: '/fornecedoras',
  },
  {
    id: uuidv4(),
    title: 'Transportadoras',
    icon: IconTruck,
    href: '/transportadoras',
  },
  {
    id: uuidv4(),
    title: 'NFes de Compra',
    icon: IconNotes,
    href: '/nfes-compra',
  },
  {
    id: uuidv4(),
    title: 'Emprestimos',
    icon: IconReplaceUser,
    href: '/emprestimos',
  },
  {
    id: uuidv4(),
    title: 'Parceiros',
    icon: IconHeartHandshake,
    href: '/parceiros',
  },
  {
    id: uuidv4(),
    title: 'Armazéns',
    icon: IconBuildingWarehouse,
    href: '/armazens',
  },
  {
    id: uuidv4(),
    title: 'Estoques',
    icon: IconPackages,
    href: '/estoques',
  },
  {
    id: uuidv4(),
    title: 'Categorias',
    icon: IconCategoryPlus,
    href: '/categorias',
  },
  {
    id: uuidv4(),
    title: 'Requisitantes',
    icon: IconUserUp,
    href: '/requisitantes',
  },
  {
    id: uuidv4(),
    title: 'Setores',
    icon: IconAffiliate,
    href: '/setores',
  },
  {
    id: uuidv4(),
    title: 'Insumos',
    icon: IconBox,
    href: '/insumos',
  },
  {
    id: uuidv4(),
    title: 'Requisições',
    icon: IconChecklist,
    href: '/requisicoes-estoque',
  },
  {
    navlabel: true,
    subheader: 'Administração',
  },
  {
    id: uuidv4(),
    title: 'Usuários',
    icon: IconUsers,
    href: '/users',
  },
  {
    id: uuidv4(),
    title: 'Organizações',
    icon: IconBinaryTree,
    href: '/organizations',
  },
  {
    id: uuidv4(),
    title: 'Configurações',
    icon: IconSettings,
    href: '/settings',
  },
]

export default Menuitems
