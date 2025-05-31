"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { useTriplitHooks } from "@daveyplate/better-auth-ui/triplit"
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
    const { data: sessionData, isPending } = authClient.useSession()

    useTriplitAuth()
    const { hooks } = useTriplitHooks({
        triplit,
        sessionData,
        isPending,
        usePlural: true
    })

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themeColor={{
                light: "oklch(1 0 0)",
                dark: "oklch(0.145 0 0)"
            }}
        >
            <AuthUIProvider
                authClient={authClient}
                hooks={hooks}
                multiSession
                redirectTo="/todos"
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
