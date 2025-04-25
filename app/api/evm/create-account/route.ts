import { NextResponse } from "next/server"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"

export async function POST(request: Request) {
  try {
    const { type, ownerAddress } = await request.json()

    if (type === "regular") {
      // Generar una nueva clave privada y cuenta
      const privateKey = generatePrivateKey()
      const account = privateKeyToAccount(privateKey)

      // Guardar la clave privada de forma segura (en una base de datos real)
      // Aquí solo la guardamos en memoria para la demostración
      const accountData = {
        address: account.address,
        privateKey: privateKey,
      }

      // En una implementación real, guardarías esto en una base de datos segura
      console.log("Cuenta creada:", accountData)

      return NextResponse.json({ address: account.address })
    } else if (type === "smart" && ownerAddress) {
      // Para una cuenta smart, normalmente se usaría un contrato de cuenta abstracta
      // Aquí simulamos una dirección derivada del ownerAddress
      const smartAccountAddress = `0x${ownerAddress.substring(2, 10)}000000000000000000000000000000000${Math.floor(
        Math.random() * 10000,
      )
        .toString()
        .padStart(4, "0")}`

      return NextResponse.json({ address: smartAccountAddress })
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
