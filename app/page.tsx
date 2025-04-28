"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EvmAccountPanel } from "@/components/evm-account-panel"
import { SolanaAccountPanel } from "@/components/solana-account-panel"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("evm")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Simplified initialization
  useEffect(() => {
    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setLoading(false)

      // Show a toast notification that we're in demo mode
      toast({
        title: "Demo Mode Active",
        description: "This demo uses environment variables configured on the server.",
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [toast])

  // Create a simple API keys object that will be passed to components
  const apiKeys = {
    apiKeyId: process.env.CDP_API_KEY_ID || "demo-mode",
    apiKeySecret: process.env.CDP_API_KEY_SECRET || "demo-mode",
    walletSecret: process.env.CDP_WALLET_SECRET || "demo-mode",
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Coinbase v2 Wallet API Demo</h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl">
          Create blockchain accounts, fund with test tokens, and transfer funds on Ethereum and Solana networks
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evm">EVM (Ethereum)</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
          </TabsList>

          <TabsContent value="evm">
            <EvmAccountPanel apiKeys={apiKeys} />
          </TabsContent>

          <TabsContent value="solana">
            <SolanaAccountPanel apiKeys={apiKeys} />
          </TabsContent>
        </Tabs>
      )}
    </main>
  )
}
