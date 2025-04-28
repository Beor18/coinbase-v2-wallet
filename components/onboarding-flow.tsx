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
      title: "Welcome to your Digital Wallet",
      description: "A simple way to manage your digital assets",
      content: (
        <div className="space-y-6 py-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h3 className="text-xl font-medium">What is a digital wallet?</h3>
            <p className="text-muted-foreground">
              A digital wallet is like your bank account in the world of cryptocurrencies. It allows you to store, send,
              and receive digital assets securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Secure</h4>
              <p className="text-sm text-muted-foreground">Your assets are protected with the best technology</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Coins className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Versatile</h4>
              <p className="text-sm text-muted-foreground">Compatible with multiple types of digital assets</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Check className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium">Easy to use</h4>
              <p className="text-sm text-muted-foreground">Designed to be intuitive even if you're a beginner</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Create your first account",
      description: "Choose the type of account you want to create",
      content: (
        <div className="space-y-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6 hover:border-primary cursor-pointer">
              <h3 className="text-xl font-medium mb-2">Ethereum Account</h3>
              <p className="text-muted-foreground mb-4">
                Ideal for interacting with applications and services based on Ethereum.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Compatible with thousands of applications
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Support for popular tokens
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Moderate transaction fees
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-6 hover:border-primary cursor-pointer">
              <h3 className="text-xl font-medium mb-2">Solana Account</h3>
              <p className="text-muted-foreground mb-4">Perfect for fast and low-cost transactions.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Ultra-fast transactions
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Very low transaction fees
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Growing ecosystem
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Tip:</strong> If you're a beginner, we recommend starting with an Ethereum account on the test
              network. This way you can practice without using real money.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "All set!",
      description: "Your digital wallet is configured and ready to use",
      content: (
        <div className="space-y-6 py-8 text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium">Congratulations!</h3>
            <p className="text-muted-foreground mt-2">
              You have successfully set up your digital wallet. Now you can start exploring the world of digital assets.
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg text-left">
            <h4 className="font-medium mb-2">Next steps:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Get free test funds to experiment
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Make your first transaction
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Explore compatible applications
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
            Back
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
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Start"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
