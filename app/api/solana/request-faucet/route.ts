import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { address, token } = await request.json()

    // Simulamos un pequeño retraso para que parezca una llamada a API real
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al solicitar fondos del faucet de Solana:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al solicitar fondos del faucet de Solana" },
      { status: 500 },
    )
  }
}
