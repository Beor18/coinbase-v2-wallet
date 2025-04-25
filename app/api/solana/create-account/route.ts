import { NextResponse } from "next/server"
import { Keypair } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    // Generar un nuevo par de claves Solana
    const keypair = Keypair.generate()
    const address = keypair.publicKey.toString()

    // En una implementación real, guardarías la clave privada de forma segura
    // Aquí solo la guardamos en memoria para la demostración
    const accountData = {
      address: address,
      secretKey: Buffer.from(keypair.secretKey).toString("hex"),
    }

    console.log("Cuenta Solana creada:", accountData)

    return NextResponse.json({ address })
  } catch (error) {
    console.error("Error creating Solana account:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear la cuenta Solana" },
      { status: 500 },
    )
  }
}
