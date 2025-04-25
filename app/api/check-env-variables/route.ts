import { NextResponse } from "next/server"

export async function GET() {
  // Verificar si las variables de entorno están disponibles
  const apiKeyId = process.env.CDP_API_KEY_ID
  const apiKeySecret = process.env.CDP_API_KEY_SECRET
  const walletSecret = process.env.CDP_WALLET_SECRET

  const available = !!apiKeyId && !!apiKeySecret && !!walletSecret

  // Por seguridad, no devolvemos los valores reales
  return NextResponse.json({
    available,
    message: available
      ? "Las variables de entorno están configuradas"
      : "Las variables de entorno no están configuradas",
  })
}
