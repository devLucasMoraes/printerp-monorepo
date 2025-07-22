import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { useCallback } from 'react'
import { ZodError } from 'zod'

import type { InfNFe } from '../schemas/nfe'
import { XmlNFeSchema } from '../schemas/nfe'
import type { NfeData } from '../types'

export interface UseXmlImportOptions {
  onSuccess?: (data: NfeData) => void
  onError?: (error: string) => void
  onValidationError?: (error: string) => void
}

export interface UseXmlImportReturn {
  parseXmlFile: (file: File) => Promise<NfeData | null>
  isValidXmlFile: (file: File) => boolean
}

/**
 * Hook personalizado para importação e parsing de arquivos XML de NFe
 *
 * @param options - Opções de callback para sucesso e erro
 * @returns Funções para validação e parsing de arquivos XML
 */
export const useXmlImport = (
  options: UseXmlImportOptions = {},
): UseXmlImportReturn => {
  const { onSuccess, onError, onValidationError } = options

  const isValidXmlFile = useCallback((file: File): boolean => {
    if (!file) return false

    const isXmlExtension = file.name.toLowerCase().endsWith('.xml')
    const isXmlMimeType =
      file.type === 'text/xml' || file.type === 'application/xml'

    return isXmlExtension || isXmlMimeType
  }, [])

  const extractNfeData = useCallback((nfeInfo: InfNFe): NfeData | null => {
    try {
      // Extrai seções principais
      const ide = nfeInfo.ide
      const emit = nfeInfo.emit
      const dest = nfeInfo.dest
      const total = nfeInfo.total.ICMSTot
      const transp = nfeInfo.transp

      return {
        // Identificação da nota
        numeroNfe: ide.nNF,
        serie: ide.serie,
        chaveAcesso: (nfeInfo['@_Id'] || '').replace('NFe', ''),
        dataEmissao: ide.dhEmi,

        // Dados do emitente (fornecedor)
        fornecedor: {
          cnpj: emit.CNPJ,
          razaoSocial: emit.xNome,
          nomeFantasia: emit.xFant || '',
          endereco: {
            logradouro: emit.enderEmit?.xLgr || '',
            numero: emit.enderEmit?.nro || '',
            bairro: emit.enderEmit?.xBairro || '',
            municipio: emit.enderEmit?.xMun || '',
            uf: emit.enderEmit?.UF || '',
            cep: emit.enderEmit?.CEP || '',
          },
        },

        // Dados do destinatário
        destinatario: {
          cnpj: dest.CNPJ || '',
          cpf: dest.CPF || '',
          razaoSocial: dest.xNome,
          endereco: {
            logradouro: dest.enderDest?.xLgr || '',
            numero: dest.enderDest?.nro || '',
            bairro: dest.enderDest?.xBairro || '',
            municipio: dest.enderDest?.xMun || '',
            uf: dest.enderDest?.UF || '',
            cep: dest.enderDest?.CEP || '',
          },
        },

        // Valores totais
        valores: {
          valorTotalProdutos: Number(total.vProd),
          valorTotalNfe: Number(total.vNF),
          valorFrete: Number(total.vFrete),
          valorSeguro: Number(total.vSeg),
          valorDesconto: Number(total.vDesc),
          valorOutros: Number(total.vOutro),
          valorTotalIpi: Number(total.vIPI),
        },

        // Dados da transportadora
        transportadora: {
          cnpj: transp.transporta?.CNPJ || '',
          razaoSocial: transp.transporta?.xNome || '',
          endereco: {
            municipio: transp.transporta?.xMun || '',
            uf: transp.transporta?.UF || '',
          },
        },

        // Lista de produtos
        produtos: (() => {
          return nfeInfo.det.map((item) => ({
            codigo: item.prod.cProd,
            descricao: item.prod.xProd,
            quantidade: Number(item.prod.qCom),
            valorUnitario: Number(item.prod.vUnCom),
            valorTotal: Number(item.prod.vProd),
            valorIpi: Number(item.imposto.IPI) || 0,
            unidade: item.prod.uCom,
            ncm: item.prod.NCM,
            cfop: item.prod.CFOP,
          }))
        })(),
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao extrair dados da NFe'
      throw new Error(errorMessage)
    }
  }, [])

  const parseXmlFile = useCallback(
    async (file: File): Promise<NfeData | null> => {
      try {
        if (!isValidXmlFile(file)) {
          const error = 'Por favor, selecione um arquivo XML válido'
          onValidationError?.(error)
          return null
        }

        // Lê o conteúdo do arquivo
        const xmlContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = () => reject(new Error('Erro ao ler o arquivo'))
          reader.readAsText(file, 'UTF-8')
        })

        // Validação da estrutura XML
        const validationResult = XMLValidator.validate(xmlContent, {
          allowBooleanAttributes: true,
          unpairedTags: [],
        })

        if (validationResult !== true) {
          const error = `XML inválido: ${validationResult.err.msg} na linha ${validationResult.err.line}`
          onValidationError?.(error)
          return null
        }

        // Parse do XML
        const parser = new XMLParser({
          ignoreAttributes: false, // Preserva atributos XML
          attributeNamePrefix: '@_', // Prefixo para distinguir atributos
          textNodeName: '#text', // Nome para nós de texto
          parseAttributeValue: false, // Converte valores dos atributos
          trimValues: true, // Remove espaços em branco desnecessários
          removeNSPrefix: false, // Mantém prefixos de namespace
          alwaysCreateTextNode: false, // Otimização de memória
          numberParseOptions: {
            hex: false, // Ignora números hexadecimais
            leadingZeros: true, // Mantém zeros iniciais (ex: "001")
            skipLike: /.*/, // Expressão regular que ignora TODOS os números
          },
          tagValueProcessor: (_, tagValue) => String(tagValue),
          isArray: (name: string) => {
            // Define elementos que devem ser sempre tratados como arrays
            // Importante para NFe onde alguns elementos podem aparecer múltiplas vezes
            const arrayElements = ['det', 'dup', 'detPag']
            return arrayElements.includes(name)
          },
          stopNodes: ['*.CDATA'], // Para elementos CDATA se necessário
        })

        const parsedData = parser.parse(xmlContent)
        console.log('Dados parseados:', parsedData)

        const validatedInfNFe = validateAndParseNFe(parsedData)
        console.log('Dados validados:', validatedInfNFe)

        // Extração dos dados da NFe
        const nfeData = extractNfeData(validatedInfNFe)

        if (!nfeData) {
          const error = 'Estrutura de NFe não reconhecida no arquivo XML'
          onError?.(error)
          return null
        }

        // Callback de sucesso
        onSuccess?.(nfeData)
        return nfeData
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro inesperado ao processar o arquivo XML'

        onError?.(errorMessage)
        return null
      }
    },
    [isValidXmlFile, extractNfeData, onSuccess, onError, onValidationError],
  )

  return {
    parseXmlFile,
    isValidXmlFile,
  }
}

export function validateAndParseNFe(parsedXml: unknown): InfNFe {
  try {
    // Primeiro valida a estrutura completa
    const validatedData = XmlNFeSchema.parse(parsedXml)

    // Extrai os dados da infNFe baseado na estrutura encontrada
    let infNFe: InfNFe

    if ('nfeProc' in validatedData) {
      infNFe = validatedData.nfeProc.NFe.infNFe
    } else if ('NFe' in validatedData) {
      infNFe = validatedData.NFe.infNFe
    } else {
      infNFe = validatedData.infNFe
    }

    return infNFe
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ')
      console.error(error)
      throw new Error(`Erro de validação do XML da NFe: ${errorMessages}`)
    }
    throw error
  }
}
