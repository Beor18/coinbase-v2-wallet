import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Importar dinámicamente el SDK para evitar problemas de inicialización en tiempo de compilación
    const { CdpClient } = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP según la documentación
    const cdp = new CdpClient()

    // Crear una cuenta Solana
    const account = await cdp.solana.createAccount()

    return NextResponse.json({ address: account.address })
  } catch (error) {
    console.error("Error creating Solana account:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear la cuenta Solana" },
      { status: 500 },
    )
  }
}
