import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { address, network, to, value } = await request.json()

    // En una implementación real, aquí se firmaría y enviaría la transacción
    // Para esta demostración, simulamos un hash de transacción
    const transactionHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(
      "",
    )}`

    console.log(`Transacción simulada de ${address} a ${to} por ${value} ETH en ${network}`)
    console.log(`Hash de transacción simulado: ${transactionHash}`)

    return NextResponse.json({ transactionHash })
  } catch (error) {
    console.error("Error sending transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar la transacción" },
      { status: 500 },
    )
  }
}
