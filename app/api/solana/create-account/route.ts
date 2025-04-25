import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Configurar variables de entorno para el SDK de CDP
    const apiKeyId = process.env.CDP_API_KEY_ID
    const apiKeySecret = process.env.CDP_API_KEY_SECRET
    const walletSecret = process.env.CDP_WALLET_SECRET

    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      throw new Error("Variables de entorno no configuradas")
    }

    // Importar dinámicamente para evitar problemas de inicialización
    const { CdpClient } = await import("@coinbase/cdp-sdk")
    const cdp = new CdpClient()

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
