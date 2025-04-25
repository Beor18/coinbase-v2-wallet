import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { type, ownerAddress } = await request.json()

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

    if (type === "regular") {
      const evmAccount = await cdp.evm.createAccount()
      return NextResponse.json({ address: evmAccount.address })
    } else if (type === "smart" && ownerAddress) {
      // Para cuentas smart, necesitamos una cuenta propietaria
      const smartAccount = await cdp.evm.createSmartAccount({
        owner: { address: ownerAddress },
      })
      return NextResponse.json({ address: smartAccount.address })
    } else {
      return NextResponse.json(
        { error: "Para crear una cuenta smart, se necesita una cuenta regular como propietaria" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error al crear cuenta EVM:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear la cuenta" },
      { status: 500 },
    )
  }
}
