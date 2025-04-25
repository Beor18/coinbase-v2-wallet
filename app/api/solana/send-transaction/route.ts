import { NextResponse } from "next/server"
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

export async function POST(request: Request) {
  try {
    const { address, to, amount } = await request.json()

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

    const connection = new Connection("https://api.devnet.solana.com")

    // Convert amount to lamports (1 SOL = 1e9 lamports)
    const lamportsToSend = Math.floor(Number.parseFloat(amount) * 1e9)

    const fromAddress = new PublicKey(address)
    const toAddress = new PublicKey(to)

    const { blockhash } = await connection.getLatestBlockhash()

    const transaction = new Transaction()
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: fromAddress,
        toPubkey: toAddress,
        lamports: lamportsToSend,
      }),
    )

    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromAddress

    const serializedTx = Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString("base64")

    const { signature: txSignature } = await cdp.solana.signTransaction({
      address,
      transaction: serializedTx,
    })
    const decodedSignedTx = Buffer.from(txSignature, "base64")

    const txSendSignature = await connection.sendRawTransaction(decodedSignedTx)

    const latestBlockhash = await connection.getLatestBlockhash()

    const confirmation = await connection.confirmTransaction({
      signature: txSendSignature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    })

    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`)
    }

    return NextResponse.json({ signature: txSendSignature })
  } catch (error) {
    console.error("Error sending Solana transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al enviar la transacción de Solana" },
      { status: 500 },
    )
  }
}
