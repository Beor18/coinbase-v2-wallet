import { NextResponse } from "next/server"
import { generateRandomTransactionHash } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { address, to, amount } = await request.json()

    // Simulamos un pequeño retraso para que parezca una llamada a API real
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generamos un hash de transacción aleatorio (sin el prefijo 0x para Solana)
    const signature = generateRandomTransactionHash("")

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("Error al enviar transacción de Solana:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar la transacción de Solana" },
      { status: 500 },
    )
  }
}
