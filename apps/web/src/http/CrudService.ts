import { Page, PageParams } from '../types'
import { api } from './api/axios'

export interface ICrudService<ID, REQ, RES> {
  getAllPaginated(params?: PageParams): Promise<Page<RES>>
  getAll(): Promise<RES[]>
  getById(id: ID): Promise<RES>
  create(entity: REQ): Promise<RES>
  update(id: ID, entity: REQ): Promise<RES>
  delete(id: ID): Promise<void>
}

export abstract class CrudService<ID, REQ, RES>
  implements ICrudService<ID, REQ, RES>
{
  // eslint-disable-next-line no-useless-constructor
  constructor(protected endpoint: string) {}

  async getAllPaginated({
    page = 0,
    size = 20,
    sort,
  }: PageParams = {}): Promise<Page<RES>> {
    const response = await api.get<Page<RES>>(this.endpoint, {
      params: { page, size, sort },
    })
    return response.data
  }

  async getAll(): Promise<RES[]> {
    const response = await api.get<RES[]>(`${this.endpoint}-all`)
    return response.data
  }

  async getById(id: ID): Promise<RES> {
    const response = await api.get<RES>(`${this.endpoint}/${id}`)
    return response.data
  }

  async create(data: REQ): Promise<RES> {
    const response = await api.post<RES>(this.endpoint, data)
    return response.data
  }

  async update(id: ID, data: REQ): Promise<RES> {
    const response = await api.put<RES>(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: ID): Promise<void> {
    const response = await api.delete<void>(`${this.endpoint}/${id}`)
    return response.data
  }
}
