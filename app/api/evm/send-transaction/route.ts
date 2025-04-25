import { NextResponse } from "next/server"
import { parseEther } from "viem"

export async function POST(request: Request) {
  try {
    const { address, network, to, value } = await request.json()

    // Importar dinámicamente el SDK para evitar problemas de inicialización en tiempo de compilación
    const { CdpClient } = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP según la documentación
    const cdp = new CdpClient()

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
