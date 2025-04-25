import { NextResponse } from "next/server"
import { generateRandomSolanaAddress } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    // Simulamos un pequeño retraso para que parezca una llamada a API real
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generamos una dirección Solana aleatoria
    const address = generateRandomSolanaAddress()

    return NextResponse.json({ address })
  } catch (error) {
    console.error("Error al crear cuenta Solana:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear la cuenta Solana" },
      { status: 500 },
    )
  }
}
