import { NextResponse } from "next/server"
import { generateRandomEthereumAddress } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { type, ownerAddress } = await request.json()

    // En lugar de usar el SDK real, generamos una dirección aleatoria
    const address = generateRandomEthereumAddress()

    // Simulamos un pequeño retraso para que parezca una llamada a API real
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ address })
  } catch (error) {
    console.error("Error al crear cuenta EVM:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear la cuenta" },
      { status: 500 },
    )
  }
}
