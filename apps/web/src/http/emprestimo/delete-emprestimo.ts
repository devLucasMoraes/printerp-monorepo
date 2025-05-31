import { api } from '../api/axios'

export async function deleteEmprestimo(emprestimoId: string, orgSlug: string) {
  await api.delete(`/organizations/${orgSlug}/emprestimos/${emprestimoId}`)
}
