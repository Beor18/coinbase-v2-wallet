import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"

export async function POST(request: Request) {
  try {
    const { address, network } = await request.json()

    // Validar los parámetros de entrada
    if (!address || !network) {
      return NextResponse.json({ error: "Se requieren los parámetros address y network" }, { status: 400 })
    }

    // Seleccionar la cadena correcta basada en el parámetro network
    const chain = network === "base-sepolia" ? baseSepolia : sepolia

    // Crear un cliente público para interactuar con la blockchain
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    // Obtener el balance
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    })

    // Convertir el balance de wei a ETH (18 decimales)
    const balanceInEth = Number(balance) / 10 ** 18

    return NextResponse.json({ balance: balanceInEth.toString() })
  } catch (error) {
    console.error("Error al verificar el balance:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al verificar el balance" },
      { status: 500 },
    )
  }
}
