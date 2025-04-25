"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyBlock, dracula } from "react-code-blocks"

export function IntegrationGuide() {
  const [activeTab, setActiveTab] = useState("quickstart")

  const codeExamples = {
    createAccount: `// Crear una cuenta Ethereum
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient();

const evmAccount = await cdp.evm.createAccount();
console.log(\`Cuenta creada: \${evmAccount.address}\`);`,

    requestFunds: `// Solicitar fondos de prueba
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient();

const { transactionHash } = await cdp.evm.requestFaucet({
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  network: "base-sepolia",
  token: "eth",
});

console.log(\`Fondos solicitados: \${transactionHash}\`);`,

    sendTransaction: `// Enviar una transacción
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

console.log(\`Transacción enviada: \${txResult.transactionHash}\`);`,

    smartAccount: `// Crear una cuenta inteligente
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient();

const evmAccount = await cdp.evm.createAccount();
const smartAccount = await cdp.evm.createSmartAccount({
  owner: evmAccount,
});

console.log(\`Cuenta inteligente creada: \${smartAccount.address}\`);`,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Guía para Desarrolladores</h2>
        <p className="text-muted-foreground mt-1">Integra la API de Coinbase v2 Wallet en tu aplicación</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quickstart">Inicio Rápido</TabsTrigger>
          <TabsTrigger value="examples">Ejemplos</TabsTrigger>
          <TabsTrigger value="sdk">SDK</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="quickstart" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Primeros pasos</h3>
            <p className="text-muted-foreground mt-1">
              Sigue estos pasos para integrar la API de Coinbase v2 Wallet en tu aplicación.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">1. Instalación</h4>
              <div className="mt-2 bg-muted p-2 rounded">
                <code>npm install @coinbase/cdp-sdk</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">2. Configuración</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Configura las variables de entorno con tus credenciales:
              </p>
              <div className="mt-2 bg-muted p-2 rounded">
                <code>
                  export CDP_API_KEY_ID=tu-api-key-id
                  <br />
                  export CDP_API_KEY_SECRET=tu-api-key-secret
                  <br />
                  export CDP_WALLET_SECRET=tu-wallet-secret
                </code>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">3. Crear una cuenta</h4>
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
            Ver documentación completa
          </Button>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Ejemplos de código</h3>
            <p className="text-muted-foreground mt-1">Ejemplos prácticos para las operaciones más comunes.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium">Solicitar fondos de prueba</h4>
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
              <h4 className="font-medium">Enviar una transacción</h4>
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
              <h4 className="font-medium">Crear una cuenta inteligente</h4>
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
            <h3 className="text-lg font-medium">SDK de Coinbase</h3>
            <p className="text-muted-foreground mt-1">Información sobre el SDK y sus capacidades.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Características principales</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Creación y gestión de cuentas blockchain</li>
                <li>• Soporte para múltiples redes (Ethereum, Solana)</li>
                <li>• Envío y recepción de transacciones</li>
                <li>• Creación de cuentas inteligentes</li>
                <li>• Acceso a faucets de prueba</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Redes soportadas</h4>
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
            <h4 className="font-medium">Requisitos</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Node.js v18 o superior</li>
              <li>• Credenciales de API de Coinbase</li>
              <li>• Conexión a internet</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-6 py-4">
          <div>
            <h3 className="text-lg font-medium">Widgets para tu aplicación</h3>
            <p className="text-muted-foreground mt-1">
              Componentes pre-construidos que puedes integrar en tu aplicación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Widget de Billetera</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Muestra el balance y permite realizar transacciones básicas.
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrar Widget
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Widget de Transacciones</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Muestra el historial de transacciones con detalles.</p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrar Widget
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Widget de Pago</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Permite a los usuarios pagar con criptomonedas en tu aplicación.
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrar Widget
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4">
                <h4 className="font-medium">Widget de Onboarding</h4>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Guía a los usuarios en la creación de su primera billetera.
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Integrar Widget
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
