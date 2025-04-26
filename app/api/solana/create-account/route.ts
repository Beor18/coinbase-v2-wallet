import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Importar el SDK de Coinbase de forma dinámica
    const CdpSdk = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP
    const cdp = new CdpSdk.CdpClient()

    // Crear una cuenta Solana usando el SDK
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
