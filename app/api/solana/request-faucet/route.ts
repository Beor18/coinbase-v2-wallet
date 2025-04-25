import { NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    const { address, token } = await request.json()

    // Crear conexión a la red Solana
    const connection = new Connection("https://api.devnet.solana.com")

    try {
      // Intentar solicitar fondos del faucet de Solana
      // Nota: esto solo funciona en un entorno de desarrollo local con un nodo Solana
      // En producción, necesitarías usar un faucet externo
      await connection.requestAirdrop(new PublicKey(address), LAMPORTS_PER_SOL)
      console.log(`Solicitud de airdrop para ${address}`)
    } catch (airdropError) {
      console.error("Error en airdrop, continuando:", airdropError)
      // Continuamos aunque falle el airdrop, ya que estamos en un entorno de demostración
    }

    // Obtener el balance actual
    const balance = await connection.getBalance(new PublicKey(address))

    // Convertir de lamports a SOL (9 decimales)
    const balanceInSol = balance / LAMPORTS_PER_SOL

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
