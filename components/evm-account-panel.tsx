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

interface EvmAccountPanelProps {
  apiKeys: {
    apiKeyId: string
    apiKeySecret: string
    walletSecret: string
  }
}

interface EvmAccount {
  address: string
  type: "regular" | "smart"
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

export function EvmAccountPanel({ apiKeys }: EvmAccountPanelProps) {
  const [accounts, setAccounts] = useState<EvmAccount[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [network, setNetwork] = useState("base-sepolia")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { toast } = useToast()

  // Load accounts from localStorage when mounting the component
  useEffect(() => {
    const storedAccounts = localStorage.getItem("evm_accounts")
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts))
    }

    const storedTransactions = localStorage.getItem("evm_transactions")
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    }
  }, [])

  // Save accounts to localStorage when they change
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem("evm_accounts", JSON.stringify(accounts))
    }
  }, [accounts])

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("evm_transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  const createAccount = async (type: "regular" | "smart") => {
    setLoading(`creating-${type}`)
    setError(null)

    try {
      // Call the server action to create an account
      const response = await fetch("/api/evm/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          ownerAddress: type === "smart" && selectedAccount ? selectedAccount : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error creating account")
      }

      const data = await response.json()

      const newAccount: EvmAccount = {
        address: data.address,
        type: type,
        balance: "0.0",
        network: network,
      }

      setAccounts([...accounts, newAccount])
      setSelectedAccount(data.address)

      toast({
        title: "Account created",
        description: `Address: ${data.address.substring(0, 10)}...`,
      })
    } catch (err) {
      console.error("Error creating account:", err)
      setError(err instanceof Error ? err.message : "Error creating account")

      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Error creating account",
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
      // Add transaction to history as pending
      const pendingTxHash = `pending-${Date.now()}`
      const pendingTransaction: Transaction = {
        hash: pendingTxHash,
        from: "Faucet",
        to: selectedAccount,
        amount: "0.05", // Estimated value that will be updated with the real value
        token: "ETH",
        timestamp: new Date().toISOString(),
        status: "pending",
        type: "receive",
        network: network,
      }

      setTransactions([pendingTransaction, ...transactions])

      // Call the server action to request funds from the faucet
      const response = await fetch("/api/evm/request-faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAccount,
          network: network,
          token: "eth",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error requesting funds")
      }

      const data = await response.json()
      const txHash = data.transactionHash

      // Update the pending transaction with the real hash
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) =>
          tx.hash === pendingTxHash
            ? {
                ...tx,
                hash: txHash,
                status: data.confirmed ? "success" : "pending",
                amount: data.balance, // Update with the real balance
              }
            : tx,
        ),
      )

      toast({
        title: "Request sent",
        description: "Waiting for transaction confirmation...",
      })

      // If the transaction is already confirmed in the response
      if (data.confirmed) {
        // Update the account balance
        setAccounts((prevAccounts) =>
          prevAccounts.map((acc) => (acc.address === selectedAccount ? { ...acc, balance: data.balance } : acc)),
        )

        // Update the transaction status
        setTransactions((prevTransactions) =>
          prevTransactions.map((tx) => (tx.hash === txHash ? { ...tx, status: "success" } : tx)),
        )

        toast({
          title: "Funds received",
          description: `Transaction: ${txHash.substring(0, 10)}...`,
        })
      } else {
        // If not confirmed, we check the status after some time
        setTimeout(async () => {
          try {
            // Check the current balance
            const checkResponse = await fetch("/api/evm/check-balance", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                address: selectedAccount,
                network: network,
              }),
            })

            if (checkResponse.ok) {
              const balanceData = await checkResponse.json()

              // Update the account balance
              setAccounts((prevAccounts) =>
                prevAccounts.map((acc) =>
                  acc.address === selectedAccount ? { ...acc, balance: balanceData.balance } : acc,
                ),
              )

              // Update the transaction status
              setTransactions((prevTransactions) =>
                prevTransactions.map((tx) =>
                  tx.hash === txHash ? { ...tx, status: "success", amount: balanceData.balance } : tx,
                ),
              )

              toast({
                title: "Funds received",
                description: `Updated balance: ${balanceData.balance} ETH`,
              })
            }
          } catch (checkError) {
            console.error("Error checking balance:", checkError)
          }
        }, 10000) // Check after 10 seconds
      }
    } catch (err) {
      console.error("Error requesting funds:", err)
      setError(err instanceof Error ? err.message : "Error requesting funds")

      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Error requesting funds",
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
      // Call the server action to send the transaction
      const response = await fetch("/api/evm/send-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: selectedAccount,
          network: network,
          to: recipientAddress,
          value: transferAmount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error sending transaction")
      }

      const data = await response.json()
      const txHash = data.transactionHash

      // Add transaction to history
      const newTransaction: Transaction = {
        hash: txHash,
        from: selectedAccount,
        to: recipientAddress,
        amount: transferAmount,
        token: "ETH",
        timestamp: new Date().toISOString(),
        status: "success",
        type: "send",
        network: network,
      }

      setTransactions([newTransaction, ...transactions])

      // Update the account balance
      const amount = Number.parseFloat(transferAmount)
      const selectedAccountObj = accounts.find((acc) => acc.address === selectedAccount)

      if (selectedAccountObj) {
        const newBalance = Math.max(0, Number.parseFloat(selectedAccountObj.balance) - amount).toString()
        setAccounts(accounts.map((acc) => (acc.address === selectedAccount ? { ...acc, balance: newBalance } : acc)))
      }

      setRecipientAddress("")
      setTransferAmount("")

      toast({
        title: "Transaction sent",
        description: `Hash: ${txHash.substring(0, 10)}...`,
      })
    } catch (err) {
      console.error("Error sending transaction:", err)
      setError(err instanceof Error ? err.message : "Error sending transaction")

      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Error sending transaction",
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
      title: "Copied to clipboard",
      description: "The address has been copied",
    })
  }

  const getExplorerUrl = (hash: string) => {
    if (network === "base-sepolia") {
      return `https://sepolia.basescan.org/tx/${hash}`
    } else {
      return `https://sepolia.etherscan.io/tx/${hash}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>EVM Accounts</CardTitle>
            <CardDescription>Create and manage Ethereum accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Network</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base-sepolia">Base Sepolia (Testnet)</SelectItem>
                  <SelectItem value="ethereum-sepolia">Ethereum Sepolia (Testnet)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Available accounts</Label>
              {accounts.length === 0 ? (
                <div className="text-sm text-muted-foreground py-2">No accounts created</div>
              ) : (
                <Select value={selectedAccount || undefined} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.address} value={account.address}>
                        {account.address.substring(0, 6)}...{account.address.substring(38)} (
                        {account.type === "smart" ? "Smart" : "Regular"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => createAccount("regular")}
                disabled={loading === "creating-regular"}
                variant="outline"
                className="justify-start"
              >
                {loading === "creating-regular" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create regular account
              </Button>

              <Button
                onClick={() => createAccount("smart")}
                disabled={loading === "creating-smart" || !selectedAccount}
                variant="outline"
                className="justify-start"
              >
                {loading === "creating-smart" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create smart account
              </Button>
              {!selectedAccount && (
                <p className="text-xs text-muted-foreground">Select a regular account to create a smart account</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Manage your account and make transactions</CardDescription>
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
                <h3 className="text-lg font-medium">No account selected</h3>
                <p className="text-sm text-muted-foreground mt-1">Create or select an account to view its details</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Address</Label>
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
                    <Label className="text-sm text-muted-foreground">Account type</Label>
                    <div className="mt-1 font-medium">
                      {getSelectedAccount()?.type === "smart" ? "Smart Account" : "Regular Account"}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Balance</Label>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-3xl font-bold">{getSelectedAccount()?.balance}</span>
                    <span className="ml-1 text-muted-foreground">ETH</span>
                  </div>
                </div>

                {Number.parseFloat(getSelectedAccount()?.balance || "0") === 0 && (
                  <Button onClick={requestFaucet} disabled={loading === "faucet"} className="w-full">
                    {loading === "faucet" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Requesting funds...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Request ETH from faucet
                      </>
                    )}
                  </Button>
                )}

                {Number.parseFloat(getSelectedAccount()?.balance || "0") > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-medium">Send funds</h3>

                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient address</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (ETH)</Label>
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
                          Sending transaction...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send funds
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
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all transactions made</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transactions to show</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Hash</th>
                    <th className="text-left py-2 px-2 font-medium">Type</th>
                    <th className="text-left py-2 px-2 font-medium">From</th>
                    <th className="text-left py-2 px-2 font-medium">To</th>
                    <th className="text-left py-2 px-2 font-medium">Amount</th>
                    <th className="text-left py-2 px-2 font-medium">Date</th>
                    <th className="text-left py-2 px-2 font-medium">Status</th>
                    <th className="text-left py-2 px-2 font-medium">Explorer</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-mono text-xs">{tx.hash.substring(0, 10)}...</td>
                      <td className="py-2 px-2">{tx.type === "send" ? "Send" : "Receive"}</td>
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
                      <td className="py-2 px-2">{tx.status === "success" ? "Completed" : "Pending"}</td>
                      <td className="py-2 px-2">
                        {tx.status === "success" && (
                          <a
                            href={getExplorerUrl(tx.hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            View <ExternalLink className="ml-1 h-3 w-3" />
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
