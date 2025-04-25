import { NextResponse } from "next/server"
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { CdpClient } from "@coinbase/cdp-sdk"

export async function POST(request: Request) {
  try {
    const { address, to, amount } = await request.json()

    // Inicializar el cliente CDP según la documentación
    const cdp = new CdpClient()

    // Crear conexión a la red Solana
    const connection = new Connection("https://api.devnet.solana.com")

    // Convertir amount a lamports (1 SOL = 1e9 lamports)
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
