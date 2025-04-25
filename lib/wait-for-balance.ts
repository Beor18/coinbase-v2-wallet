/**
 * Espera hasta que el balance de una cuenta sea mayor que cero
 * @param checkBalanceFn Función que verifica el balance
 * @param maxAttempts Número máximo de intentos
 * @param interval Intervalo entre intentos en milisegundos
 * @returns El balance final
 */
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
