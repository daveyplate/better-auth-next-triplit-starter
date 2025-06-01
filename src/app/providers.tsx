"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { type ReactNode, useMemo } from "react"
import { Toaster } from "sonner"
import { setActiveSession } from "@/better-auth-persistent/set-active-session"
import { useDeviceSessions } from "@/better-auth-persistent/use-device-sessions"
import { useConditionalQuery } from "@/hooks/use-conditional-query"
import { useTriplitAuth } from "@/hooks/use-triplit-auth"
import { useTriplitSession } from "@/hooks/use-triplit-session"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    useTriplitAuth({ triplit, authClient })
    const { data: sessionData } = useTriplitSession()
    const userId = sessionData?.user.id

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
                    useSession: useTriplitSession,
                    useListDeviceSessions: useDeviceSessions,
                    useListSessions: () => {
                        const {
                            results: data,
                            fetching: isPending,
                            error
                        } = useConditionalQuery(
                            triplit,
                            triplit.query("sessions").Where("userId", "=", userId)
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
                            triplit.query("accounts").Where("userId", "=", userId)
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
                    setActiveSession: setActiveSession,
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

                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}
