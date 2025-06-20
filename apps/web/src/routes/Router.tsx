import { lazy } from 'react'
import { Navigate } from 'react-router'

import Loadable from '../layouts/full/shared/Loadable'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')))
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')))

/* ****Private Pages***** */
const Dashboard = Loadable(lazy(() => import('../page/dashboard/Dashboard')))
const Settings = Loadable(lazy(() => import('../page/settings/Settings')))
const Users = Loadable(lazy(() => import('../page/users/Users')))
const Categorias = Loadable(lazy(() => import('../page/categorias/Categorias')))
const Requisitantes = Loadable(
  lazy(() => import('../page/requisitantes/Requisitantes')),
)
const Setores = Loadable(lazy(() => import('../page/setores/Setores')))
const Insumos = Loadable(lazy(() => import('../page/insumos/Insumos')))
const RequisicoesEstoque = Loadable(
  lazy(() => import('../page/requisicoes-estoque/RequisicoesEstoque')),
)
const Armazens = Loadable(lazy(() => import('../page/armazens/Armazens')))
const Estoques = Loadable(lazy(() => import('../page/estoques/Estoques')))
const Emprestimos = Loadable(
  lazy(() => import('../page/emprestimos/Emprestimos')),
)
const Parceiros = Loadable(lazy(() => import('../page/parceiros/Parceiros')))
const Organizations = Loadable(
  lazy(() => import('../page/organizations/Organizations')),
)
const Fornecedoras = Loadable(
  lazy(() => import('../page/fornecedoras/Fornecedoras')),
)
const Transportadoras = Loadable(
  lazy(() => import('../page/transportadoras/Transportadoras')),
)
const NfesCompra = Loadable(
  lazy(() => import('../page/nfes-compra/NfesCompra')),
)

/* ****Public Pages***** */
const Register = Loadable(lazy(() => import('../page/authentication/Register')))
const Login = Loadable(lazy(() => import('../page/authentication/Login')))

const Error = Loadable(lazy(() => import('../page/Error')))

const Router = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <FullLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" /> },
          { path: '/dashboard', exact: true, element: <Dashboard /> },
          { path: '/settings', exact: true, element: <Settings /> },
          { path: '/users', exact: true, element: <Users /> },
          { path: '/categorias', exact: true, element: <Categorias /> },
          { path: '/requisitantes', exact: true, element: <Requisitantes /> },
          { path: '/setores', exact: true, element: <Setores /> },
          { path: '/insumos', exact: true, element: <Insumos /> },
          {
            path: '/requisicoes-estoque',
            exact: true,
            element: <RequisicoesEstoque />,
          },
          { path: '/armazens', exact: true, element: <Armazens /> },
          { path: '/estoques', exact: true, element: <Estoques /> },
          { path: '/emprestimos', exact: true, element: <Emprestimos /> },
          { path: '/parceiros', exact: true, element: <Parceiros /> },
          { path: '/organizations', exact: true, element: <Organizations /> },
          { path: '/fornecedoras', exact: true, element: <Fornecedoras /> },
          {
            path: '/transportadoras',
            exact: true,
            element: <Transportadoras />,
          },
          {
            path: '/nfes-compra',
            exact: true,
            element: <NfesCompra />,
          },
        ],
      },
    ],
  },
  {
    path: '/organizations/:orgSlug',
    element: <PrivateRoute />,
    children: [
      {
        path: '/organizations/:orgSlug',
        element: <FullLayout />,
        children: [
          // Redirecionar para dashboard da organização
          { path: '', element: <Navigate to="dashboard" replace /> },

          // Páginas da organização
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'settings', element: <Settings /> },
          { path: 'users', element: <Users /> },
          { path: 'categorias', element: <Categorias /> },
          { path: 'requisitantes', element: <Requisitantes /> },
          { path: 'setores', element: <Setores /> },
          { path: 'insumos', element: <Insumos /> },
          { path: 'requisicoes-estoque', element: <RequisicoesEstoque /> },
          { path: 'armazens', element: <Armazens /> },
          { path: 'estoques', element: <Estoques /> },
          { path: 'emprestimos', element: <Emprestimos /> },
          { path: 'parceiros', element: <Parceiros /> },
          { path: 'organizations', element: <Organizations /> },
          { path: 'fornecedoras', element: <Fornecedoras /> },
          { path: 'transportadoras', element: <Transportadoras /> },
          { path: 'nfes-compra', element: <NfesCompra /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      {
        path: '/auth',
        element: <BlankLayout />,
        children: [
          { path: 'register', element: <Register /> },
          { path: 'login', element: <Login /> },
        ],
      },
    ],
  },
  {
    path: '/auth/404',
    element: <Error />,
  },
  {
    path: '*',
    element: <Navigate to="/auth/404" />,
  },
]

export default Router
