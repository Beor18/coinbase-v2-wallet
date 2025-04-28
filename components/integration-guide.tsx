"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyBlock, dracula } from "react-code-blocks"

export function IntegrationGuide() {
  const [activeTab, setActiveTab] = useState("quickstart")

  const codeExamples = {
    createAccount: `// Create an Ethereum account
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient();

const evmAccount = await cdp.evm.createAccount();
console.log(\`Account created: \${evmAccount.address}\`);`,

    requestFunds: `// Request test funds
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient();

const { transactionHash } = await cdp.evm.requestFaucet({
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  network: "base-sepolia",
  token: "eth",
});

console.log(\`Funds requested: \${transactionHash}\`);`,

    sendTransaction: `// Send a transaction
import { CdpClient } from "@coinbase/cdp-sdk";
import { parseEther } from "viem";

const cdp = new CdpClient();

const txResult = await cdp.evm.sendTransaction({
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  network: "base-sepolia",
  transaction: {
    to: "0x4252e0c9A3da5A2700e7d91cb50aEf522D0C6Fe8",
    value: parseEther("0.001"),
  },
});

console.log(\`Transaction sent: \${txResult.transactionHash}\`);`,

    smartAccount: `// Create a smart account
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient();

const evmAccount = await cdp.evm.createAccount();
const smartAccount = await cdp.evm.createSmartAccount({
  owner: evmAccount,
});

console.log(\`Smart account created: \${smartAccount.address}\`);`,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Developer Guide</h2>
        <p className="text-muted-foreground mt-1">Integrate the Coinbase v2 Wallet API into your application</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="sdk">SDK</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="quickstart" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Getting Started</h3>
            <p className="text-muted-foreground mt-1">
              Follow these steps to integrate the Coinbase v2 Wallet API into your application.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">1. Installation</h4>
              <div className="mt-2 bg-muted p-2 rounded">
                <code>npm install @coinbase/cdp-sdk</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">2. Configuration</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Configure environment variables with your credentials:
              </p>
              <div className="mt-2 bg-muted p-2 rounded">
                <code>
                  export CDP_API_KEY_ID=your-api-key-id
                  <br />
                  export CDP_API_KEY_SECRET=your-api-key-secret
                  <br />
                  export CDP_WALLET_SECRET=your-wallet-secret
                </code>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">3. Create an account</h4>
              <div className="mt-2">
                <CopyBlock
                  text={codeExamples.createAccount}
                  language="javascript"
                  theme={dracula}
                  showLineNumbers={true}
                  wrapLines
                />
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            View complete documentation
          </Button>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Code Examples</h3>
            <p className="text-muted-foreground mt-1">Practical examples for the most common operations.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium">Request test funds</h4>
              <div className="mt-2">
                <CopyBlock
                  text={codeExamples.requestFunds}
                  language="javascript"
                  theme={dracula}
                  showLineNumbers={true}
                  wrapLines
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium">Send a transaction</h4>
              <div className="mt-2">
                <CopyBlock
                  text={codeExamples.sendTransaction}
                  language="javascript"
                  theme={dracula}
                  showLineNumbers={true}
                  wrapLines
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium">Create a smart account</h4>
              <div className="mt-2">
                <CopyBlock
                  text={codeExamples.smartAccount}
                  language="javascript"
                  theme={dracula}
                  showLineNumbers={true}
                  wrapLines
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sdk" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Coinbase SDK</h3>
            <p className="text-muted-foreground mt-1">Information about the SDK and its capabilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Main Features</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Creation and management of blockchain accounts</li>
                <li>• Support for multiple networks (Ethereum, Solana)</li>
                <li>• Sending and receiving transactions</li>
                <li>• Creation of smart accounts</li>
                <li>• Access to test faucets</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Supported Networks</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Ethereum Mainnet</li>
                <li>• Ethereum Sepolia (Testnet)</li>
                <li>• Base Mainnet</li>
                <li>• Base Sepolia (Testnet)</li>
                <li>• Solana Mainnet</li>
                <li>• Solana Devnet</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Requirements</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Node.js v18 or higher</li>
              <li>• Coinbase API credentials</li>
              <li>• Internet connection</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Widgets for your application</h3>
            <p className="text-muted-foreground mt-1">
              Pre-built components that you can integrate into your application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Wallet Widget</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Shows the balance and allows basic transactions.</p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrate Widget
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Transactions Widget</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Shows transaction history with details.</p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrate Widget
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Payment Widget</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Allows users to pay with cryptocurrencies in your application.
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrate Widget
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Onboarding Widget</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Guides users in creating their first wallet.</p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrate Widget
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
