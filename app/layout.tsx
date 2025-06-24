import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import HelpWidget from "./components/help-widget"
import OnboardingTooltips from "./components/onboarding-tooltips"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Connectus",
  description: "Modern church management system",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
            <HelpWidget />
            <OnboardingTooltips />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
