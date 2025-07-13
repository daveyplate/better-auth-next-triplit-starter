"use client"

import {
    setActiveSession,
    useListDeviceSessions,
    useSubscribeDeviceSessions
} from "@daveyplate/better-auth-persistent"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { type ReactNode, useMemo } from "react"
import { Toaster } from "sonner"

import { MetaTheme } from "@/components/meta-theme"
import { ThemeSync } from "@/components/theme-sync"
import { useConditionalQuery } from "@/hooks/use-conditional-query"
import { useSession } from "@/hooks/use-session"
import { useTriplitAuth } from "@/hooks/use-triplit-auth"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export function Providers({ children }: { children: ReactNode }) {
    useTriplitAuth(triplit)
    useSubscribeDeviceSessions()
    const { data: sessionData } = useSession()
    const userId = sessionData?.user.id

    const router = useRouter()

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
                hooks={{
                    useSession,
                    useListDeviceSessions,
                    useListSessions: () => {
                        const {
                            results: data,
                            fetching: isPending,
                            error
                        } = useConditionalQuery(
                            triplit,
                            sessionData &&
                                triplit
                                    .query("sessions")
                                    .Where("userId", "=", userId)
                        )

                        return { data, isPending, error }
                    },
                    useListAccounts: () => {
                        const {
                            results,
                            fetching: isPending,
                            error
                        } = useConditionalQuery(
                            triplit,
                            sessionData &&
                                triplit
                                    .query("accounts")
                                    .Where("userId", "=", userId)
                        )

                        const data = useMemo(() => {
                            return results?.map((account) => ({
                                accountId: account.id,
                                provider: account.providerId
                            }))
                        }, [results])

                        return { data, isPending, error }
                    }
                }}
                mutators={{
                    setActiveSession,
                    updateUser: (params) =>
                        triplit.update("users", userId!, {
                            ...params,
                            updatedAt: new Date()
                        }),
                    revokeSession: async ({ token }) => {
                        const session = await triplit.fetchOne(
                            triplit.query("sessions").Where("token", "=", token)
                        )

                        if (!session) throw new Error("Session not found")

                        await triplit.http.delete("sessions", session.id)
                    },
                    unlinkAccount: async ({ accountId }) => {
                        if (!accountId) throw new Error("Account not found")

                        await triplit.http.delete("accounts", accountId)
                    }
                }}
                navigate={router.push}
                replace={router.replace}
                onSessionChange={() => {
                    router.refresh()
                }}
                Link={Link}
            >
                {children}

                <MetaTheme />
                <ThemeSync />
                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}
