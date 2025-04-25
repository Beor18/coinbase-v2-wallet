"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, ArrowDownRight, Copy, RefreshCw, HelpCircle, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WalletDashboard() {
  const [activeTab, setActiveTab] = useState("ethereum")
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)

  const accounts = {
    ethereum: {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      balance: "0.05",
      token: "ETH",
      network: "Red de Prueba (Sepolia)",
    },
    solana: {
      address: "8ZUczUAUSLX5QT4xkJNAK9PbfQC6cGLPAKLvJZKKpRs9",
      balance: "1.0",
      token: "SOL",
      network: "Red de Prueba (Devnet)",
    },
  }

  const currentAccount = activeTab === "ethereum" ? accounts.ethereum : accounts.solana

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="solana">Solana</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Mi Cuenta</CardTitle>
              <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{currentAccount.network}</div>
            </div>
            <CardDescription>Gestiona tus activos digitales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-muted-foreground">Dirección de la billetera</Label>
                <div className="flex items-center mt-1">
                  <code className="bg-muted px-3 py-1 rounded text-sm font-mono flex-1 overflow-x-auto">
                    {currentAccount.address}
                  </code>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Esta es la dirección única de tu billetera. Compártela para recibir fondos.
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Balance</Label>
                <div className="flex items-baseline mt-1">
                  <span className="text-4xl font-bold">{currentAccount.balance}</span>
                  <span className="ml-2 text-xl">{currentAccount.token}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Estás usando una red de prueba. Estos fondos no tienen valor real.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => setShowSendDialog(true)}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => setShowReceiveDialog(true)}>
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Recibir
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Obtener fondos de prueba</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guía Rápida</CardTitle>
            <CardDescription>Aprende a usar tu billetera</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  ¿Qué es {activeTab === "ethereum" ? "Ethereum" : "Solana"}?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "ethereum"
                    ? "Ethereum es una plataforma blockchain que permite crear aplicaciones descentralizadas y tokens digitales."
                    : "Solana es una blockchain de alta velocidad y bajo costo, ideal para aplicaciones que requieren rapidez."}
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  ¿Qué puedo hacer?
                </h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Enviar y recibir activos digitales</li>
                  <li>• Interactuar con aplicaciones</li>
                  <li>• Almacenar tokens digitales</li>
                </ul>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="w-full justify-start p-0 h-auto">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ver más ayuda
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Centro de Ayuda</DialogTitle>
                    <DialogDescription>Guías y recursos para usar tu billetera digital</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium">¿Qué es una red de prueba?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Las redes de prueba son versiones de blockchain que funcionan igual que las principales, pero
                        los activos no tienen valor real. Son perfectas para aprender y experimentar.
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium">¿Cómo obtengo fondos reales?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Para usar fondos reales, necesitarás cambiar a una red principal y adquirir criptomonedas a
                        través de un exchange como Coinbase.
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium">¿Qué es una dirección de billetera?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Es como tu número de cuenta bancaria en el mundo cripto. Compártela para recibir fondos, pero
                        nunca compartas tus claves privadas o frases de recuperación.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <SendDialog open={showSendDialog} onOpenChange={setShowSendDialog} account={currentAccount} />

      <ReceiveDialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog} account={currentAccount} />
    </div>
  )
}

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: any
}

function SendDialog({ open, onOpenChange, account }: DialogProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar {account.token}</DialogTitle>
          <DialogDescription>Envía fondos a otra dirección de billetera</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Dirección del destinatario</Label>
            <Input
              id="recipient"
              placeholder={account.address.substring(0, 10) + "..."}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Introduce la dirección completa de la billetera del destinatario
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Cantidad a enviar</Label>
            <div className="flex">
              <Input
                id="amount"
                type="number"
                placeholder="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-r-none"
              />
              <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
                {account.token}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Balance disponible: {account.balance} {account.token}
            </p>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Información importante
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              • Verifica siempre la dirección del destinatario antes de enviar
              <br />• Las transacciones en blockchain son irreversibles
              <br />• Estás usando una red de prueba ({account.network})
            </p>
          </div>

          <Button className="w-full" disabled={!amount || !recipient}>
            Enviar {amount ? `${amount} ${account.token}` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReceiveDialog({ open, onOpenChange, account }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recibir {account.token}</DialogTitle>
          <DialogDescription>Comparte tu dirección para recibir fondos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-muted flex items-center justify-center mb-4">
              {/* Aquí iría un código QR */}
              <div className="text-center text-muted-foreground">Código QR de tu dirección</div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium">Tu dirección de {account.token === "ETH" ? "Ethereum" : "Solana"}</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block overflow-x-auto">{account.address}</code>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copiar dirección
            </Button>
            <Button variant="outline" className="flex-1">
              Compartir
            </Button>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Información importante
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              • Comparte esta dirección para recibir {account.token}
              <br />• Asegúrate de que quien te envía use la red correcta ({account.network})
              <br />• Nunca compartas tus claves privadas o frases de recuperación
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
