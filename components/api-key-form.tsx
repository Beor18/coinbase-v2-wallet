"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ApiKeyFormProps {
  onSubmit: (keys: {
    apiKeyId: string
    apiKeySecret: string
    walletSecret: string
  }) => void
}

export function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
  const [apiKeyId, setApiKeyId] = useState("")
  const [apiKeySecret, setApiKeySecret] = useState("")
  const [walletSecret, setWalletSecret] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      setError("Todos los campos son obligatorios")
      return
    }

    onSubmit({
      apiKeyId,
      apiKeySecret,
      walletSecret,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Configuración de API</CardTitle>
        <CardDescription>Ingresa tus credenciales de la API de Coinbase para comenzar</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="apiKeyId">CDP API Key ID</Label>
          <Input
            id="apiKeyId"
            placeholder="Ingresa tu API Key ID"
            value={apiKeyId}
            onChange={(e) => setApiKeyId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apiKeySecret">CDP API Key Secret</Label>
          <Input
            id="apiKeySecret"
            type="password"
            placeholder="Ingresa tu API Key Secret"
            value={apiKeySecret}
            onChange={(e) => setApiKeySecret(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="walletSecret">CDP Wallet Secret</Label>
          <Input
            id="walletSecret"
            type="password"
            placeholder="Ingresa tu Wallet Secret"
            value={walletSecret}
            onChange={(e) => setWalletSecret(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full">
          Conectar API
        </Button>
      </CardFooter>
    </form>
  )
}
