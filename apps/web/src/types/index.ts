export interface Page<T> {
  content: T[] // Conteúdo da página
  totalPages: number // Número total de páginas
  totalElements: number // Número total de elementos
  size: number // Tamanho da página
  number: number // Número da página atual
  numberOfElements: number // Número de elementos na página atual
  empty: boolean // Indica se a página está vazia
}

export interface PageParams {
  page?: number // Número da página solicitada
  size?: number // Tamanho da página solicitada
  sort?: string | string[] // Critérios de ordenação
  filters?: Record<string, unknown> // Filtros a serem aplicados
}

export interface ErrorResponse {
  message: string
}

export interface NfeData {
  numeroNfe: string
  serie: string
  chaveAcesso: string
  dataEmissao: string
  fornecedor: {
    cnpj: string
    razaoSocial: string
    nomeFantasia: string
    endereco: {
      logradouro: string
      numero: string
      bairro: string
      municipio: string
      uf: string
      cep: string
    }
  }
  destinatario: {
    cnpj: string
    cpf: string
    razaoSocial: string
    endereco: {
      logradouro: string
      numero: string
      bairro: string
      municipio: string
      uf: string
      cep: string
    }
  }
  valores: {
    valorTotalProdutos: number
    valorTotalNfe: number
    valorFrete: number
    valorSeguro: number
    valorDesconto: number
    valorOutros: number
    valorTotalIpi: number
  }
  transportadora: {
    cnpj: string
    razaoSocial: string
    endereco: {
      municipio: string
      uf: string
    }
  }
  produtos: {
    codigo: string
    descricao: string
    quantidade: number
    valorUnitario: number
    valorTotal: number
    unidade: string
    ncm: string
    cfop: string
    valorIpi: number
  }[]
}
