"use client"

import {
    setActiveSession,
    useListDeviceSessions,
    useSubscribeDeviceSessions
} from "@daveyplate/better-auth-persistent"
import { useTriplitAuth } from "@daveyplate/better-auth-triplit"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { useQuery, useQueryOne } from "@triplit/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { type ReactNode, useMemo } from "react"
import { Toaster } from "sonner"
import { MetaTheme } from "@/components/meta-theme"
import { ThemeSync } from "@/components/theme-sync"
import { useSession } from "@/hooks/use-session"
import { useToken } from "@/hooks/use-token"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export function Providers({ children }: { children: ReactNode }) {
    const { data: sessionData, isPending } = useSession()
    const { token } = useToken(triplit)
    useTriplitAuth(triplit, { sessionData, isPending })
    useSubscribeDeviceSessions()
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
                apiKey
                organization={{
                    apiKey: true
                }}
                hooks={{
                    useSession,
                    useListDeviceSessions,
                    useListSessions: () => {
                        const {
                            results: data,
                            fetching: isPending,
                            error
                        } = useQuery(
                            triplit,
                            triplit
                                .query("sessions")
                                .Where("userId", "=", userId),
                            {
                                enabled: !!token
                            }
                        )

                        return { data, isPending, error }
                    },
                    useListAccounts: () => {
                        const {
                            results,
                            fetching: isPending,
                            error
                        } = useQuery(
                            triplit,
                            triplit
                                .query("accounts")
                                .Where("userId", "=", userId),
                            {
                                enabled: !!token
                            }
                        )

                        const data = useMemo(() => {
                            return results?.map((account) => ({
                                accountId: account.id,
                                provider: account.providerId
                            }))
                        }, [results])

                        return { data, isPending, error }
                    },
                    useActiveOrganization() {
                        const result = authClient.useActiveOrganization()
                        const activeOrganization = result?.data

                        const { result: organization } = useQueryOne(
                            triplit,
                            triplit
                                .query("organizations")
                                .Where("id", "=", activeOrganization?.id),
                            { enabled: !!activeOrganization }
                        )

                        if (activeOrganization && organization) {
                            activeOrganization.name = organization.name
                            activeOrganization.slug = organization.slug
                            activeOrganization.logo = organization.logo
                            activeOrganization.metadata = organization.metadata
                        }

                        return result
                    },
                    useListApiKeys() {
                        const { token } = useToken(triplit)

                        const {
                            results: data,
                            fetching: isPending,
                            error
                        } = useQuery(triplit, triplit.query("apikeys"), {
                            enabled: !!token
                        })

                        return { data, isPending, error }
                    },
                    useListOrganizations() {
                        const { data: sessionData } = useSession()
                        const { token } = useToken(triplit)

                        const {
                            results: data,
                            fetching: isPending,
                            error
                        } = useQuery(
                            triplit,
                            triplit
                                .query("organizations")
                                .Where(
                                    "members.userId",
                                    "=",
                                    sessionData?.user.id
                                ),
                            { enabled: !!token }
                        )

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
