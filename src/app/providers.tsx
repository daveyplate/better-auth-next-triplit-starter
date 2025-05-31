"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { useTriplitAuth } from "@/hooks/use-triplit-auth"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()
    useTriplitAuth({ triplit, authClient })

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthUIProvider
                authClient={authClient}
                multiSession
                navigate={router.push}
                replace={router.replace}
                onSessionChange={() => {
                    router.refresh()
                }}
                Link={Link}
            >
                {children}

                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}
