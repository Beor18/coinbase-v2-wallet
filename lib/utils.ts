import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para generar una dirección Ethereum aleatoria
export function generateRandomEthereumAddress(): string {
  const chars = "0123456789abcdef"
  let result = "0x"
  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// Función para generar una dirección Solana aleatoria
export function generateRandomSolanaAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  let result = ""
  for (let i = 0; i < 44; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// Función para generar un hash de transacción aleatorio
export function generateRandomTransactionHash(prefix = "0x"): string {
  const chars = "0123456789abcdef"
  let result = prefix
  for (let i = 0; i < 64; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// Función para esperar hasta que el balance de una cuenta sea mayor que cero
export async function waitForBalance(
  checkBalanceFn: () => Promise<string>,
  maxAttempts = 30,
  interval = 1000,
): Promise<string> {
  let balance = "0"
  let attempts = 0

  while (Number.parseFloat(balance) === 0 && attempts < maxAttempts) {
    balance = await checkBalanceFn()

    if (Number.parseFloat(balance) === 0) {
      await new Promise((resolve) => setTimeout(resolve, interval))
      attempts++
    }
  }

  if (Number.parseFloat(balance) === 0) {
    throw new Error("No se recibieron fondos después de múltiples intentos")
  }

  return balance
}
