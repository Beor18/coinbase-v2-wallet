"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ApiKeyForm } from "@/components/api-key-form"
import { EvmAccountPanel } from "@/components/evm-account-panel"
import { SolanaAccountPanel } from "@/components/solana-account-panel"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [apiKeys, setApiKeys] = useState<{
    apiKeyId: string
    apiKeySecret: string
    walletSecret: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState("evm")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Usar directamente las variables de entorno del servidor
  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        // Intentar usar las variables de entorno del servidor
        const response = await fetch("/api/check-env-variables")
        const data = await response.json()

        if (data.available) {
          setApiKeys({
            apiKeyId: process.env.CDP_API_KEY_ID || "",
            apiKeySecret: process.env.CDP_API_KEY_SECRET || "",
            walletSecret: process.env.CDP_WALLET_SECRET || "",
          })

          toast({
            title: "Credenciales configuradas",
            description: "Usando las credenciales configuradas en el servidor",
          })
        } else {
          // Verificar localStorage como respaldo
          const storedApiKeyId = localStorage.getItem("CDP_API_KEY_ID")
          const storedApiKeySecret = localStorage.getItem("CDP_API_KEY_SECRET")
          const storedWalletSecret = localStorage.getItem("CDP_WALLET_SECRET")

          if (storedApiKeyId && storedApiKeySecret && storedWalletSecret) {
            setApiKeys({
              apiKeyId: storedApiKeyId,
              apiKeySecret: storedApiKeySecret,
              walletSecret: storedWalletSecret,
            })
          }
        }
      } catch (error) {
        console.error("Error al verificar las variables de entorno:", error)

        // Verificar localStorage como respaldo
        const storedApiKeyId = localStorage.getItem("CDP_API_KEY_ID")
        const storedApiKeySecret = localStorage.getItem("CDP_API_KEY_SECRET")
        const storedWalletSecret = localStorage.getItem("CDP_WALLET_SECRET")

        if (storedApiKeyId && storedApiKeySecret && storedWalletSecret) {
          setApiKeys({
            apiKeyId: storedApiKeyId,
            apiKeySecret: storedApiKeySecret,
            walletSecret: storedWalletSecret,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    checkApiKeys()
  }, [toast])

  const handleApiKeysSubmit = (keys: {
    apiKeyId: string
    apiKeySecret: string
    walletSecret: string
  }) => {
    // Guardar las claves API en localStorage
    localStorage.setItem("CDP_API_KEY_ID", keys.apiKeyId)
    localStorage.setItem("CDP_API_KEY_SECRET", keys.apiKeySecret)
    localStorage.setItem("CDP_WALLET_SECRET", keys.walletSecret)

    setApiKeys(keys)
    toast({
      title: "API Keys configuradas",
      description: "Tus claves de API han sido guardadas correctamente.",
    })
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Coinbase v2 Wallet API Demo</h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl">
          Crea cuentas blockchain, financia con tokens de prueba y transfiere fondos fácilmente
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando...</span>
        </div>
      ) : !apiKeys ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <ApiKeyForm onSubmit={handleApiKeysSubmit} />
          </CardContent>
        </Card>
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
