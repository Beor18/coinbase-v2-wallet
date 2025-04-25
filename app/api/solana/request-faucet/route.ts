import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    const { address, token } = await request.json()

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

    // Crear conexión a la red Solana
    const connection = new Connection("https://api.devnet.solana.com")

    // Solicitar fondos del faucet
    await cdp.solana.requestFaucet({
      address,
      token,
    })

    // Esperar a que el balance se actualice
    const balance = await waitForSolanaBalance(connection, address)

    return NextResponse.json({
      confirmed: true,
      balance: balance.toString(),
    })
  } catch (error) {
    console.error("Error requesting funds from Solana faucet:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al solicitar fondos del faucet de Solana" },
      { status: 500 },
    )
  }
}

// Función para esperar a que el balance de Solana se actualice
async function waitForSolanaBalance(connection: Connection, address: string, maxAttempts = 30): Promise<number> {
  let balance = 0
  let attempts = 0

  while (balance === 0 && attempts < maxAttempts) {
    balance = await connection.getBalance(new PublicKey(address))

    if (balance === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      attempts++
    }
  }

  if (balance === 0) {
    throw new Error("No se recibieron fondos después de múltiples intentos")
  }

  // Convertir de lamports a SOL (9 decimales)
  return balance / 10 ** 9
}
