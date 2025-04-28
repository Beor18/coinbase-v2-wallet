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
      network: "Test Network (Sepolia)",
    },
    solana: {
      address: "8ZUczUAUSLX5QT4xkJNAK9PbfQC6cGLPAKLvJZKKpRs9",
      balance: "1.0",
      token: "SOL",
      network: "Test Network (Devnet)",
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
              <CardTitle>My Account</CardTitle>
              <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{currentAccount.network}</div>
            </div>
            <CardDescription>Manage your digital assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-muted-foreground">Wallet Address</Label>
                <div className="flex items-center mt-1">
                  <code className="bg-muted px-3 py-1 rounded text-sm font-mono flex-1 overflow-x-auto">
                    {currentAccount.address}
                  </code>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This is the unique address of your wallet. Share it to receive funds.
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Balance</Label>
                <div className="flex items-baseline mt-1">
                  <span className="text-4xl font-bold">{currentAccount.balance}</span>
                  <span className="ml-2 text-xl">{currentAccount.token}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You are using a test network. These funds have no real value.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => setShowSendDialog(true)}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => setShowReceiveDialog(true)}>
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Receive
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get test funds</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Guide</CardTitle>
            <CardDescription>Learn how to use your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  What is {activeTab === "ethereum" ? "Ethereum" : "Solana"}?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "ethereum"
                    ? "Ethereum is a blockchain platform that allows creating decentralized applications and digital tokens."
                    : "Solana is a high-speed, low-cost blockchain, ideal for applications that require speed."}
                </p>
              </div>

              <div className="p-3 border rounded-lg">
                <h3 className="font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  What can I do?
                </h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Send and receive digital assets</li>
                  <li>• Interact with applications</li>
                  <li>• Store digital tokens</li>
                </ul>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="w-full justify-start p-0 h-auto">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    View more help
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Help Center</DialogTitle>
                    <DialogDescription>Guides and resources for using your digital wallet</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium">What is a test network?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Test networks are versions of blockchain that work just like the main ones, but the assets have
                        no real value. They're perfect for learning and experimenting.
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium">How do I get real funds?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        To use real funds, you'll need to switch to a main network and acquire cryptocurrencies through
                        an exchange like Coinbase.
                      </p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium">What is a wallet address?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        It's like your bank account number in the crypto world. Share it to receive funds, but never
                        share your private keys or recovery phrases.
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
          <DialogTitle>Send {account.token}</DialogTitle>
          <DialogDescription>Send funds to another wallet address</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient address</Label>
            <Input
              id="recipient"
              placeholder={account.address.substring(0, 10) + "..."}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Enter the complete address of the recipient's wallet</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount to send</Label>
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
              Available balance: {account.balance} {account.token}
            </p>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Important information
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              • Always verify the recipient's address before sending
              <br />• Blockchain transactions are irreversible
              <br />• You are using a test network ({account.network})
            </p>
          </div>

          <Button className="w-full" disabled={!amount || !recipient}>
            Send {amount ? `${amount} ${account.token}` : ""}
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
          <DialogTitle>Receive {account.token}</DialogTitle>
          <DialogDescription>Share your address to receive funds</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
            <div className="w-48 h-48 bg-muted flex items-center justify-center mb-4">
              {/* QR code would go here */}
              <div className="text-center text-muted-foreground">QR code of your address</div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium">Your {account.token === "ETH" ? "Ethereum" : "Solana"} address</p>
              <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block overflow-x-auto">{account.address}</code>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy address
            </Button>
            <Button variant="outline" className="flex-1">
              Share
            </Button>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Important information
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              • Share this address to receive {account.token}
              <br />• Make sure the sender uses the correct network ({account.network})
              <br />• Never share your private keys or recovery phrases
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
