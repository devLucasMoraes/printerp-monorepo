import { z } from 'zod'

const EnderecoSchema = z.object({
  xLgr: z.string().optional(),
  nro: z.string().optional(),
  xCpl: z.string().optional(),
  xBairro: z.string().optional(),
  cMun: z.string().optional(),
  xMun: z.string().optional(),
  UF: z.string().optional(),
  CEP: z.string().optional(),
  cPais: z.string().optional(),
  xPais: z.string().optional(),
  fone: z.string().optional(),
})

const IdeSchema = z.object({
  cUF: z.string(),
  cNF: z.string(),
  natOp: z.string(),
  mod: z.string(),
  serie: z.string(),
  nNF: z.string(),
  dhEmi: z.string(),
  dhSaiEnt: z.string().optional(),
  tpNF: z.string(),
  idDest: z.string(),
  cMunFG: z.string(),
  tpImp: z.string(),
  tpEmis: z.string(),
  cDV: z.string(),
  tpAmb: z.string(),
  finNFe: z.string(),
  indFinal: z.string(),
  indPres: z.string(),
  procEmi: z.string(),
  verProc: z.string(),
})

const EmitSchema = z.object({
  CNPJ: z.string(),
  xNome: z.string(),
  xFant: z.string().optional(),
  enderEmit: EnderecoSchema,
  IE: z.string(),
  CRT: z.string(),
})

const DestSchema = z.object({
  CNPJ: z.string().optional(),
  CPF: z.string().optional(),
  xNome: z.string(),
  enderDest: EnderecoSchema,
  indIEDest: z.string().optional(),
  IE: z.string().optional(),
  email: z.string().optional(),
})

const EntregaSchema = z
  .object({
    CNPJ: z.string().optional(),
    CPF: z.string().optional(),
    xLgr: z.string().optional(),
    nro: z.string().optional(),
    xCpl: z.string().optional(),
    xBairro: z.string().optional(),
    cMun: z.string().optional(),
    xMun: z.string().optional(),
    UF: z.string().optional(),
  })
  .optional()

const RastroSchema = z
  .object({
    nLote: z.string(),
    qLote: z.string(),
    dFab: z.string(),
    dVal: z.string(),
    cAgreg: z.string().optional(),
  })
  .optional()

const ProdSchema = z.object({
  cProd: z.string(),
  cEAN: z.string(),
  xProd: z.string(),
  NCM: z.string(),
  CEST: z.string().optional(),
  indEscala: z.string().optional(),
  CFOP: z.string(),
  uCom: z.string(),
  qCom: z.string(),
  vUnCom: z.string(),
  vProd: z.string(),
  cEANTrib: z.string(),
  uTrib: z.string(),
  qTrib: z.string(),
  vUnTrib: z.string(),
  indTot: z.string(),
  xPed: z.string().optional(),
  nItemPed: z.string().optional(),
  nFCI: z.string().optional(),
  rastro: RastroSchema,
})

const ICMS00Schema = z.object({
  orig: z.string(),
  CST: z.string(),
  modBC: z.string(),
  vBC: z.string(),
  pICMS: z.string(),
  vICMS: z.string(),
})

const ICMSSchema = z.object({
  ICMS00: ICMS00Schema.optional(),
})

const IPITribSchema = z.object({
  CST: z.string(),
  vBC: z.string(),
  pIPI: z.string(),
  vIPI: z.string(),
})

const IPISchema = z.object({
  cEnq: z.string().optional(),
  IPITrib: IPITribSchema.optional(),
})

const PISAliqSchema = z.object({
  CST: z.string(),
  vBC: z.string(),
  pPIS: z.string(),
  vPIS: z.string(),
})

const PISSchema = z.object({
  PISAliq: PISAliqSchema.optional(),
})

const COFINSAliqSchema = z.object({
  CST: z.string(),
  vBC: z.string(),
  pCOFINS: z.string(),
  vCOFINS: z.string(),
})

const COFINSSchema = z.object({
  COFINSAliq: COFINSAliqSchema.optional(),
})

const ImpostoSchema = z.object({
  ICMS: ICMSSchema,
  IPI: IPISchema.optional(),
  PIS: PISSchema.optional(),
  COFINS: COFINSSchema.optional(),
})

const DetSchema = z.object({
  '@_nItem': z.string(),
  prod: ProdSchema,
  imposto: ImpostoSchema,
  infAdProd: z.string().optional(),
})

const ICMSTotSchema = z.object({
  vBC: z.string(),
  vICMS: z.string(),
  vICMSDeson: z.string(),
  vFCP: z.string(),
  vBCST: z.string(),
  vST: z.string(),
  vFCPST: z.string(),
  vFCPSTRet: z.string(),
  vProd: z.string(),
  vFrete: z.string(),
  vSeg: z.string(),
  vDesc: z.string(),
  vII: z.string(),
  vIPI: z.string(),
  vIPIDevol: z.string(),
  vPIS: z.string(),
  vCOFINS: z.string(),
  vOutro: z.string(),
  vNF: z.string(),
})

const TotalSchema = z.object({
  ICMSTot: ICMSTotSchema,
})

const TransportaSchema = z.object({
  CNPJ: z.string().optional(),
  xNome: z.string(),
  IE: z.string().optional(),
  xEnder: z.string().optional(),
  xMun: z.string().optional(),
  UF: z.string().optional(),
})

const VolSchema = z.object({
  qVol: z.string().optional(),
  esp: z.string().optional(),
  pesoL: z.string().optional(),
  pesoB: z.string().optional(),
})

const TranspSchema = z.object({
  modFrete: z.string(),
  transporta: TransportaSchema.optional(),
  vol: VolSchema.optional(),
})

const FatSchema = z.object({
  nFat: z.string(),
  vOrig: z.string(),
  vDesc: z.string(),
  vLiq: z.string(),
})

const DupSchema = z.object({
  nDup: z.string(),
  dVenc: z.string(),
  vDup: z.string(),
})

const CobrSchema = z
  .object({
    fat: FatSchema,
    dup: z.array(DupSchema).optional(),
  })
  .optional()

const DetPagSchema = z.object({
  indPag: z.string().optional(),
  tPag: z.string(),
  vPag: z.string(),
})

const PagSchema = z.object({
  detPag: z.array(DetPagSchema),
})

const InfAdicSchema = z
  .object({
    infCpl: z.string().optional(),
  })
  .optional()

const InfNFeSchema = z.object({
  '@_Id': z.string(),
  '@_versao': z.string(),
  ide: IdeSchema,
  emit: EmitSchema,
  dest: DestSchema,
  entrega: EntregaSchema,
  det: z.array(DetSchema),
  total: TotalSchema,
  transp: TranspSchema,
  cobr: CobrSchema,
  pag: PagSchema,
  infAdic: InfAdicSchema,
})

const SignatureSchema = z
  .object({
    SignedInfo: z.any(),
    SignatureValue: z.string(),
    KeyInfo: z.any(),
  })
  .optional()

const NFeSchema = z.object({
  infNFe: InfNFeSchema,
  Signature: SignatureSchema,
})

const InfProtSchema = z.object({
  '@_Id': z.string(),
  tpAmb: z.string(),
  verAplic: z.string(),
  chNFe: z.string(),
  dhRecbto: z.string(),
  nProt: z.string(),
  digVal: z.string(),
  cStat: z.string(),
  xMotivo: z.string(),
})

const ProtNFeSchema = z.object({
  '@_versao': z.string(),
  infProt: InfProtSchema,
})

const NfeProcSchema = z.object({
  '@_versao': z.string(),
  '@_xmlns': z.string().optional(),
  NFe: NFeSchema,
  protNFe: ProtNFeSchema,
})

export const XmlNFeSchema = z.union([
  z.object({ nfeProc: NfeProcSchema }),
  z.object({ NFe: NFeSchema }),
  z.object({ infNFe: InfNFeSchema }),
])

export type XmlNFe = z.infer<typeof XmlNFeSchema>
export type InfNFe = z.infer<typeof InfNFeSchema>
export type NFe = z.infer<typeof NFeSchema>
export type NfeProc = z.infer<typeof NfeProcSchema>
