import { NextResponse } from "next/server"
import { parseEther } from "viem"

export async function POST(request: Request) {
  try {
    const { address, network, to, value } = await request.json()

    // Validar los parámetros de entrada
    if (!address || !network || !to || !value) {
      return NextResponse.json({ error: "Se requieren los parámetros address, network, to y value" }, { status: 400 })
    }

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

    return NextResponse.json({ transactionHash: txResult.transactionHash })
  } catch (error) {
    console.error("Error sending transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar la transacción" },
      { status: 500 },
    )
  }
}
