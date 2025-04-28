import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coinbase Wallet API Demo | Web3 Development Platform",
  description:
    "Explore the Coinbase Wallet API with this interactive demo. Create blockchain accounts, fund with test tokens, and transfer funds on Ethereum and Solana networks.",
  keywords: ["Coinbase", "Wallet API", "Blockchain", "Ethereum", "Solana", "Web3", "Cryptocurrency", "DApp"],
  authors: [{ name: "Coinbase Wallet API Demo Team" }],
  creator: "Coinbase Wallet API Demo Team",
  publisher: "Coinbase Wallet API Demo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coinbase-wallet-api-demo.vercel.app/",
    title: "Coinbase Wallet API Demo | Web3 Development Platform",
    description:
      "Interactive demo for the Coinbase Wallet API. Build blockchain applications on Ethereum and Solana networks.",
    siteName: "Coinbase Wallet API Demo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Coinbase Wallet API Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coinbase Wallet API Demo | Web3 Development Platform",
    description:
      "Interactive demo for the Coinbase Wallet API. Build blockchain applications on Ethereum and Solana networks.",
    images: ["/twitter-image.png"],
    creator: "@CoinbaseWallet",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  themeColor: "#3b82f6",
  colorScheme: "light dark",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
