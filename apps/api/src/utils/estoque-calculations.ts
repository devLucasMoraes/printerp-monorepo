export function calcularDiasRestantes(
  quantidade: number,
  consumoMedioDiario: number | null,
): number | null {
  if (!consumoMedioDiario || consumoMedioDiario <= 0) {
    return null
  }

  return Math.floor(quantidade / consumoMedioDiario)
}

export function calcularPrevisaoFimEstoque(
  quantidade: number,
  consumoMedioDiario: number | null,
): Date | null {
  const diasRestantes = calcularDiasRestantes(quantidade, consumoMedioDiario)
  if (diasRestantes === null) {
    return null
  }

  const dataPrevisao = new Date()
  dataPrevisao.setDate(dataPrevisao.getDate() + diasRestantes)
  return dataPrevisao
}

export function calcularPrevisaoEstoqueMinimo(
  quantidade: number,
  consumoMedioDiario: number | null,
  estoqueMinimo: number,
): Date | null {
  if (!consumoMedioDiario || consumoMedioDiario <= 0) {
    return null
  }

  const diasAteEstoqueMinimo = Math.floor(
    (quantidade - estoqueMinimo) / consumoMedioDiario,
  )
  if (diasAteEstoqueMinimo < 0) {
    return null // Já está abaixo do mínimo
  }

  const dataPrevisao = new Date()
  dataPrevisao.setDate(dataPrevisao.getDate() + diasAteEstoqueMinimo)
  return dataPrevisao
}
