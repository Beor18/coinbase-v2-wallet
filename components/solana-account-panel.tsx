"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wallet, Send, Plus, RefreshCw, Copy, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface SolanaAccountPanelProps {
  apiKeys: {
    apiKeyId: string
    apiKeySecret: string
    walletSecret: string
  }
}

interface SolanaAccount {
  address: string
  balance: string
  network: string
}

interface Transaction {
  hash: string
  from: string
  to: string
  amount: string
  token: string
  timestamp: string
  status: string
  type: string
  network: string
}

export function SolanaAccountPanel({ apiKeys }: SolanaAccountPanelProps) {
  const [accounts, setAccounts] = useState<SolanaAccount[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [network, setNetwork] = useState("devnet")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { toast } = useToast()

  // Cargar cuentas desde localStorage al montar el componente
  useEffect(() => {
    const storedAccounts = localStorage.getItem("solana_accounts")
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts))
    }

    const storedTransactions = localStorage.getItem("solana_transactions")
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    }
  }, [])

  // Guardar cuentas en localStorage cuando cambien
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem("solana_accounts", JSON.stringify(accounts))
    }
  }, [accounts])

  // Guardar transacciones en localStorage cuando cambien
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("solana_transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  const createAccount = async () => {
    setLoading("creating")
    setError(null)

    try {
      // Llamar a la acción del servidor para crear una cuenta Solana
      const response = await fetch("/api/solana/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la cuenta")
      }

      const data = await response.json()

      const newAccount: SolanaAccount = {
        address: data.address,
        balance: "0.0",
        network: network,
      }

      setAccounts([...accounts, newAccount])
      setSelectedAccount(data.address)

      toast({
        title: "Cuenta creada",
        description: `Dirección: ${data.address.substring(0, 10)}...`,
      })
    } catch (err) {
      console.error("Error creating account:", err)
      setError(err instanceof Error ? err.message : "Error al crear la cuenta")

      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Error al crear la cuenta",
      })
    } finally {
      setLoading(null)
    }
  }

  const requestFaucet = async () => {
    if (!selectedAccount) return

    setLoading("faucet")
    setError(null)

    try {
      // Llamar a la acción del servidor para solicitar fondos del faucet
      const response = await fetch("/api/solana/request-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAccount,
          token: "sol",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al solicitar fondos")
      }

      const data = await response.json()

      // Generar un hash de transacción para el historial
      const txHash = data.signature || "sol-" + Date.now()

      // Añadir transacción al historial
      const newTransaction: Transaction = {
        hash: txHash,
        from: "Faucet",
        to: selectedAccount,
        amount: "1.0",
        token: "SOL",
        timestamp: new Date().toISOString(),
        status: "pending",
        type: "receive",
        network: network,
      }

      setTransactions([newTransaction, ...transactions])

      toast({
        title: "Solicitud enviada",
        description: "Esperando confirmación de la transacción...",
      })

      // Si la transacción ya está confirmada en la respuesta
      if (data.confirmed) {
        // Actualizar el estado de la transacción
        setTransactions((prevTransactions) =>
          prevTransactions.map((tx) => (tx.hash === txHash ? { ...tx, status: "success" } : tx)),
        )

        // Actualizar el saldo de la cuenta
        setAccounts((prevAccounts) =>
          prevAccounts.map((acc) => (acc.address === selectedAccount ? { ...acc, balance: data.balance } : acc)),
        )

        toast({
          title: "Fondos recibidos",
          description: "Tu cuenta ha sido financiada con 1 SOL",
        })
      } else {
        // En un entorno real, aquí implementaríamos la función waitForBalance
        // Para esta demo, simulamos la espera
        setTimeout(() => {
          // Actualizar el estado de la transacción
          setTransactions((prevTransactions) =>
            prevTransactions.map((tx) => (tx.hash === txHash ? { ...tx, status: "success" } : tx)),
          )

          // Actualizar el saldo de la cuenta
          setAccounts((prevAccounts) =>
            prevAccounts.map((acc) => (acc.address === selectedAccount ? { ...acc, balance: "1.0" } : acc)),
          )

          toast({
            title: "Fondos recibidos",
            description: "Tu cuenta ha sido financiada con 1 SOL",
          })
        }, 5000)
      }
    } catch (err) {
      console.error("Error requesting funds:", err)
      setError(err instanceof Error ? err.message : "Error al solicitar fondos")

      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Error al solicitar fondos",
      })
    } finally {
      setLoading(null)
    }
  }

  const sendTransaction = async () => {
    if (!selectedAccount || !recipientAddress || !transferAmount) return

    setLoading("transfer")
    setError(null)

    try {
      // Llamar a la acción del servidor para enviar la transacción
      const response = await fetch("/api/solana/send-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAccount,
          to: recipientAddress,
          amount: transferAmount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al enviar la transacción")
      }

      const data = await response.json()
      const txHash = data.signature || "sol-tx-" + Date.now()

      // Añadir transacción al historial
      const newTransaction: Transaction = {
        hash: txHash,
        from: selectedAccount,
        to: recipientAddress,
        amount: transferAmount,
        token: "SOL",
        timestamp: new Date().toISOString(),
        status: "success",
        type: "send",
        network: network,
      }

      setTransactions([newTransaction, ...transactions])

      // Actualizar el saldo de la cuenta
      const amount = Number.parseFloat(transferAmount)
      const selectedAccountObj = accounts.find((acc) => acc.address === selectedAccount)

      if (selectedAccountObj) {
        const newBalance = Math.max(0, Number.parseFloat(selectedAccountObj.balance) - amount).toString()
        setAccounts(accounts.map((acc) => (acc.address === selectedAccount ? { ...acc, balance: newBalance } : acc)))
      }

      setRecipientAddress("")
      setTransferAmount("")

      toast({
        title: "Transacción enviada",
        description: `Hash: ${txHash.substring(0, 10)}...`,
      })
    } catch (err) {
      console.error("Error sending transaction:", err)
      setError(err instanceof Error ? err.message : "Error al enviar la transacción")

      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Error al enviar la transacción",
      })
    } finally {
      setLoading(null)
    }
  }

  const getSelectedAccount = () => {
    return accounts.find((acc) => acc.address === selectedAccount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado al portapapeles",
      description: "La dirección ha sido copiada",
    })
  }

  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=${network}`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Cuentas Solana</CardTitle>
            <CardDescription>Crea y gestiona cuentas Solana</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Red</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una red" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="devnet">Devnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cuentas disponibles</Label>
              {accounts.length === 0 ? (
                <div className="text-sm text-muted-foreground py-2">No hay cuentas creadas</div>
              ) : (
                <Select value={selectedAccount || undefined} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.address} value={account.address}>
                        {account.address.substring(0, 6)}...{account.address.substring(account.address.length - 4)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Button
              onClick={createAccount}
              disabled={loading === "creating"}
              variant="outline"
              className="w-full justify-start"
            >
              {loading === "creating" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Crear cuenta Solana
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalles de la cuenta</CardTitle>
            <CardDescription>Gestiona tu cuenta y realiza transacciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!selectedAccount ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay cuenta seleccionada</h3>
                <p className="text-sm text-muted-foreground mt-1">Crea o selecciona una cuenta para ver sus detalles</p>
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-sm text-muted-foreground">Dirección</Label>
                  <div className="flex items-center mt-1">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono break-all flex-1">
                      {getSelectedAccount()?.address}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(getSelectedAccount()?.address || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Balance</Label>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-3xl font-bold">{getSelectedAccount()?.balance}</span>
                    <span className="ml-1 text-muted-foreground">SOL</span>
                  </div>
                </div>

                {Number.parseFloat(getSelectedAccount()?.balance || "0") === 0 && (
                  <Button onClick={requestFaucet} disabled={loading === "faucet"} className="w-full">
                    {loading === "faucet" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Solicitando fondos...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Solicitar SOL del faucet
                      </>
                    )}
                  </Button>
                )}

                {Number.parseFloat(getSelectedAccount()?.balance || "0") > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-medium">Enviar fondos</h3>

                    <div className="space-y-2">
                      <Label htmlFor="recipient">Dirección del destinatario</Label>
                      <Input
                        id="recipient"
                        placeholder="Dirección Solana..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Cantidad (SOL)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.001"
                        min="0.000001"
                        max={getSelectedAccount()?.balance}
                        step="0.000001"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={sendTransaction}
                      disabled={loading === "transfer" || !recipientAddress || !transferAmount}
                      className="w-full"
                    >
                      {loading === "transfer" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando transacción...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar fondos
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de transacciones</CardTitle>
          <CardDescription>Visualiza todas las transacciones realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay transacciones para mostrar</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Hash</th>
                    <th className="text-left py-2 px-2 font-medium">Tipo</th>
                    <th className="text-left py-2 px-2 font-medium">De</th>
                    <th className="text-left py-2 px-2 font-medium">A</th>
                    <th className="text-left py-2 px-2 font-medium">Cantidad</th>
                    <th className="text-left py-2 px-2 font-medium">Fecha</th>
                    <th className="text-left py-2 px-2 font-medium">Estado</th>
                    <th className="text-left py-2 px-2 font-medium">Explorador</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-mono text-xs">{tx.hash.substring(0, 10)}...</td>
                      <td className="py-2 px-2">{tx.type === "send" ? "Envío" : "Recepción"}</td>
                      <td className="py-2 px-2">
                        {tx.from === "Faucet"
                          ? "Faucet"
                          : `${tx.from.substring(0, 6)}...${tx.from.substring(tx.from.length - 4)}`}
                      </td>
                      <td className="py-2 px-2">{`${tx.to.substring(0, 6)}...${tx.to.substring(tx.to.length - 4)}`}</td>
                      <td className="py-2 px-2">
                        {tx.amount} {tx.token}
                      </td>
                      <td className="py-2 px-2 text-sm">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-2">{tx.status === "success" ? "Completada" : "Pendiente"}</td>
                      <td className="py-2 px-2">
                        {tx.status === "success" && (
                          <a
                            href={getExplorerUrl(tx.hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            Ver <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
