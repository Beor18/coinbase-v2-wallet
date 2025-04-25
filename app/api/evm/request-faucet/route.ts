import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"

export async function POST(request: Request) {
  try {
    const { address, network, token } = await request.json()

    // Seleccionar la cadena correcta
    const chain = network === "base-sepolia" ? baseSepolia : sepolia

    // Crear un cliente público para interactuar con la blockchain
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    // En una implementación real, aquí se llamaría a un faucet externo
    // Para esta demostración, simulamos un hash de transacción
    const transactionHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(
      "",
    )}`

    console.log(`Solicitud de fondos para ${address} en ${network}`)
    console.log(`Hash de transacción simulado: ${transactionHash}`)

    // Obtener el balance actual (esto es real)
    const balance = await publicClient.getBalance({
      address: address as `0x${string}`,
    })

    // Convertir el balance de wei a ETH (18 decimales)
    const balanceInEth = Number(balance) / 10 ** 18

    return NextResponse.json({
      transactionHash,
      confirmed: true,
      balance: balanceInEth.toString(),
    })
  } catch (error) {
    console.error("Error requesting funds from faucet:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al solicitar fondos del faucet" },
      { status: 500 },
    )
  }
}
