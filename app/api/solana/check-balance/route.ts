import { NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    // Validar los parámetros de entrada
    if (!address) {
      return NextResponse.json({ error: "Se requiere el parámetro address" }, { status: 400 })
    }

    // Crear conexión a la red Solana
    const connection = new Connection("https://api.devnet.solana.com")

    // Obtener el balance
    const balance = await connection.getBalance(new PublicKey(address))

    // Convertir de lamports a SOL (9 decimales)
    const balanceInSol = balance / LAMPORTS_PER_SOL

    return NextResponse.json({ balance: balanceInSol.toString() })
  } catch (error) {
    console.error("Error al verificar el balance:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al verificar el balance" },
      { status: 500 },
    )
  }
}
