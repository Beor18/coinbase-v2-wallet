import { NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"

export async function POST(request: Request) {
  try {
    const { network, hash } = await request.json()

    const chain = network === "base-sepolia" ? baseSepolia : sepolia

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
    })

    return NextResponse.json({ receipt })
  } catch (error) {
    console.error("Error waiting for transaction:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al esperar la transacción" },
      { status: 500 },
    )
  }
}
