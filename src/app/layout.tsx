import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"

import "@/styles/globals.css"

import { Header } from "@/components/header"
import { Providers } from "./providers"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
})

export const metadata: Metadata = {
    title: "Better Auth Next.js Triplit Starter",
    description: "Better Auth Next.js Starter with Triplit & shadcn/ui"
}

export const viewport: Viewport = {
    initialScale: 1,
    viewportFit: "cover",
    width: "device-width"
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="theme-color" content="var(--bg-background)" />
            </head>

            <body
                className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col antialiased`}
            >
                <Providers>
                    <Header />

                    {children}
                </Providers>
            </body>
        </html>
    )
}
