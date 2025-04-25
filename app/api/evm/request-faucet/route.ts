import { NextResponse } from "next/server"
import { CdpClient } from "@coinbase/cdp-sdk"
import { createPublicClient, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"

export async function POST(request: Request) {
  try {
    const { address, network, token } = await request.json()

    // Inicializar el cliente CDP según la documentación
    const cdp = new CdpClient()

    // Solicitar fondos del faucet
    const { transactionHash } = await cdp.evm.requestFaucet({
      address,
      network,
      token,
    })

    // Crear un cliente público para esperar la confirmación de la transacción
    const chain = network === "base-sepolia" ? baseSepolia : sepolia
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    // Esperar a que la transacción se confirme
    await publicClient.waitForTransactionReceipt({
      hash: transactionHash as `0x${string}`,
    })

    // Obtener el balance actualizado
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
