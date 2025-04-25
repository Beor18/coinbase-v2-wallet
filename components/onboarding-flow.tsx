"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Check, Wallet, Shield, Coins } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Bienvenido a tu Billetera Digital",
      description: "Una forma sencilla de gestionar tus activos digitales",
      content: (
        <div className="space-y-6 py-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h3 className="text-xl font-medium">¿Qué es una billetera digital?</h3>
            <p className="text-muted-foreground">
              Una billetera digital es como tu cuenta bancaria en el mundo de las criptomonedas. Te permite guardar,
              enviar y recibir activos digitales de forma segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Segura</h4>
              <p className="text-sm text-muted-foreground">Tus activos están protegidos con la mejor tecnología</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Coins className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Versátil</h4>
              <p className="text-sm text-muted-foreground">Compatible con múltiples tipos de activos digitales</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Fácil de usar</h4>
              <p className="text-sm text-muted-foreground">Diseñada para ser intuitiva incluso si eres principiante</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Crea tu primera cuenta",
      description: "Elige el tipo de cuenta que deseas crear",
      content: (
        <div className="space-y-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 hover:border-primary cursor-pointer">
              <h3 className="text-xl font-medium mb-2">Cuenta Ethereum</h3>
              <p className="text-muted-foreground mb-4">
                Ideal para interactuar con aplicaciones y servicios basados en Ethereum.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Compatible con miles de aplicaciones
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Soporte para tokens populares
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Tarifas de transacción moderadas
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 hover:border-primary cursor-pointer">
              <h3 className="text-xl font-medium mb-2">Cuenta Solana</h3>
              <p className="text-muted-foreground mb-4">Perfecta para transacciones rápidas y de bajo costo.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Transacciones ultra rápidas
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Tarifas de transacción muy bajas
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Ecosistema en crecimiento
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Consejo:</strong> Si eres principiante, te recomendamos comenzar con una cuenta Ethereum en la red
              de prueba. Así podrás practicar sin usar dinero real.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "¡Todo listo!",
      description: "Tu billetera digital está configurada y lista para usar",
      content: (
        <div className="space-y-6 py-8 text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium">¡Felicidades!</h3>
            <p className="text-muted-foreground mt-2">
              Has configurado correctamente tu billetera digital. Ahora puedes comenzar a explorar el mundo de los
              activos digitales.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg text-left">
            <h4 className="font-medium mb-2">Próximos pasos:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Obtén fondos de prueba gratuitos para experimentar
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Realiza tu primera transacción
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Explora las aplicaciones compatibles
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const currentStep = steps[step]

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        <CardContent>{currentStep.content}</CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Atrás
          </Button>

          <Button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1)
              } else {
                onComplete()
              }
            }}
          >
            {step < steps.length - 1 ? (
              <>
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Comenzar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
