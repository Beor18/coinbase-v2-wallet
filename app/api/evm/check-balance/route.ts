import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { address, network } = await request.json()

    // En un entorno real, consultaríamos el balance real
    // Para esta demo, simulamos la respuesta
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulamos un balance
    const balance = "0.05"

    return NextResponse.json({ balance })
  } catch (error) {
    console.error("Error al verificar el balance:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al verificar el balance" },
      { status: 500 },
    )
  }
}
