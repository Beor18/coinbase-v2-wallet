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
