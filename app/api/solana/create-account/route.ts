import { NextResponse } from "next/server"
import { CdpClient } from "@coinbase/cdp-sdk"

export async function POST(request: Request) {
  try {
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
