import { NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    const { address, token } = await request.json()

    // Importar el SDK de Coinbase de forma dinámica
    const CdpSdk = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP
    const cdp = new CdpSdk.CdpClient()

    // Crear conexión a la red Solana
    const connection = new Connection("https://api.devnet.solana.com")

    // Solicitar fondos del faucet usando el SDK
    await cdp.solana.requestFaucet({
      address,
      token,
    })

    // Esperar a que el balance se actualice
    let balance = 0
    let attempts = 0
    const maxAttempts = 30

    while (balance === 0 && attempts < maxAttempts) {
      balance = await connection.getBalance(new PublicKey(address))

      if (balance === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        attempts++
      }
    }

    // Convertir de lamports a SOL (9 decimales)
    const balanceInSol = balance / LAMPORTS_PER_SOL

    console.log(`Received ${balanceInSol} SOL from faucet for address: ${address}`)

    return NextResponse.json({
      confirmed: true,
      balance: balanceInSol.toString(),
    })
  } catch (error) {
    console.error("Error requesting funds from Solana faucet:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al solicitar fondos del faucet de Solana" },
      { status: 500 },
    )
  }
}
