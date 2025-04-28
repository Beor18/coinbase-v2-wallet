import { ExternalLink } from "lucide-react"

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

interface TransactionHistoryProps {
  transactions: Transaction[]
  network: string
  isSolana?: boolean
}

export function TransactionHistory({ transactions, network, isSolana = false }: TransactionHistoryProps) {
  const getExplorerUrl = (hash: string) => {
    if (isSolana) {
      return `https://explorer.solana.com/tx/${hash}?cluster=${network}`
    } else {
      if (network === "base-sepolia") {
        return `https://sepolia.basescan.org/tx/${hash}`
      } else {
        return `https://sepolia.etherscan.io/tx/${hash}`
      }
    }
  }

  const formatAddress = (address: string) => {
    if (address === "Faucet") return "Faucet"
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
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
                <td className="py-2 px-2">{formatAddress(tx.from)}</td>
                <td className="py-2 px-2">{formatAddress(tx.to)}</td>
                <td className="py-2 px-2">
                  {tx.amount} {tx.token}
                </td>
                <td className="py-2 px-2 text-sm">{formatDate(tx.timestamp)}</td>
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
  )
}
