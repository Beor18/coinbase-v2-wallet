import { NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"
import { CdpClient } from "@coinbase/cdp-sdk"

export async function POST(request: Request) {
  try {
    const { address, token } = await request.json()

    // Inicializar el cliente CDP según la documentación
    const cdp = new CdpClient()

    // Crear conexión a la red Solana
    const connection = new Connection("https://api.devnet.solana.com")

    // Solicitar fondos del faucet
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

    if (balance === 0) {
      throw new Error("No se recibieron fondos después de múltiples intentos")
    }

    // Convertir de lamports a SOL (9 decimales)
    const balanceInSol = balance / 10 ** 9

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
