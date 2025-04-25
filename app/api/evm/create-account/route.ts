import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { type, ownerAddress } = await request.json()

    // Importar dinámicamente el SDK para evitar problemas de inicialización en tiempo de compilación
    const { CdpClient } = await import("@coinbase/cdp-sdk")

    // Inicializar el cliente CDP según la documentación
    const cdp = new CdpClient()

    if (type === "regular") {
      // Crear una cuenta regular
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
