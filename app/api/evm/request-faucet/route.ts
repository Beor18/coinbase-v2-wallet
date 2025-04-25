import { NextResponse } from "next/server"
import { generateRandomTransactionHash } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { address, network, token } = await request.json()

    // Simulamos un pequeño retraso para que parezca una llamada a API real
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generamos un hash de transacción aleatorio
    const transactionHash = generateRandomTransactionHash()

    return NextResponse.json({ transactionHash })
  } catch (error) {
    console.error("Error al solicitar fondos del faucet:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al solicitar fondos del faucet" },
      { status: 500 },
    )
  }
}
