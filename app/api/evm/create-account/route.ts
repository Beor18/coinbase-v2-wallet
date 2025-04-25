import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { type, ownerAddress } = await request.json()

    // Importar el SDK de Coinbase de forma dinámica
    const CdpSdk = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP
    const cdp = new CdpSdk.CdpClient()

    if (type === "regular") {
      // Crear una cuenta regular usando el SDK
      const evmAccount = await cdp.evm.createAccount()
      console.log(`Created account: ${evmAccount.address}`)
      return NextResponse.json({ address: evmAccount.address })
    } else if (type === "smart" && ownerAddress) {
      // Para cuentas smart, necesitamos una cuenta propietaria
      const smartAccount = await cdp.evm.createSmartAccount({
        owner: { address: ownerAddress },
      })
      console.log(`Created smart account: ${smartAccount.address}`)
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
