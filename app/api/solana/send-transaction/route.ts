import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { address, to, amount } = await request.json()

    // En una implementación real, aquí se firmaría y enviaría la transacción
    // Para esta demostración, simulamos una firma de transacción
    const txSendSignature = Array.from({ length: 88 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    console.log(`Transacción simulada de ${address} a ${to} por ${amount} SOL`)
    console.log(`Firma de transacción simulada: ${txSendSignature}`)

    return NextResponse.json({ signature: txSendSignature })
  } catch (error) {
    console.error("Error sending Solana transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar la transacción de Solana" },
      { status: 500 },
    )
  }
}
