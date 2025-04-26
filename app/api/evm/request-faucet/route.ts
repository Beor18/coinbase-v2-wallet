import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"

export async function POST(request: Request) {
  try {
    const { address, network, token } = await request.json()

    // Validar los parámetros de entrada
    if (!address || !network || !token) {
      return NextResponse.json({ error: "Se requieren los parámetros address, network y token" }, { status: 400 })
    }

    // Importar el SDK de Coinbase de forma dinámica
    const CdpSdk = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP
    const cdp = new CdpSdk.CdpClient()

    // Solicitar fondos del faucet usando el SDK
    const { transactionHash } = await cdp.evm.requestFaucet({
      address,
      network,
      token,
    })

    // Seleccionar la cadena correcta basada en el parámetro network
    const chain = network === "base-sepolia" ? baseSepolia : sepolia

    // Crear un cliente público para esperar la confirmación de la transacción
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
