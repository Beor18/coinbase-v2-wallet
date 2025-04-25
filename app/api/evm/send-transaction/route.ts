import { NextResponse } from "next/server"
import { parseEther } from "viem"

export async function POST(request: Request) {
  try {
    const { address, network, to, value } = await request.json()

    // Configurar variables de entorno para el SDK de CDP
    const apiKeyId = process.env.CDP_API_KEY_ID
    const apiKeySecret = process.env.CDP_API_KEY_SECRET
    const walletSecret = process.env.CDP_WALLET_SECRET

    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      throw new Error("Variables de entorno no configuradas")
    }

    // Importar dinámicamente para evitar problemas de inicialización
    const { CdpClient } = await import("@coinbase/cdp-sdk")
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
