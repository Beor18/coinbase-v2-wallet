import { NextResponse } from "next/server"
import { parseEther, formatEther } from "viem"

export async function POST(request: Request) {
  try {
    const { address, network, to, value } = await request.json()

    // Importar el SDK de Coinbase de forma dinámica
    const CdpSdk = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP
    const cdp = new CdpSdk.CdpClient()

    // Enviar la transacción usando el SDK
    const txResult = await cdp.evm.sendTransaction({
      address,
      network,
      transaction: {
        to,
        value: parseEther(value),
      },
    })

    console.log(
      `Sent ${formatEther(parseEther(value))} ETH to ${to}: https://sepolia.basescan.org/tx/${txResult.transactionHash}`,
    )

    return NextResponse.json({ transactionHash: txResult.transactionHash })
  } catch (error) {
    console.error("Error sending transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar la transacción" },
      { status: 500 },
    )
  }
}
