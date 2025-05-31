import type { Session } from "better-auth"
import type { User } from "better-auth/types"
import { useCallback, useEffect, useMemo, useState } from "react"
import superjson from "superjson"

import { authClient } from "@/lib/auth-client"
import { useIsHydrated } from "./use-hydrated"

type DeviceSession = {
    session: Session
    user: User
}

interface UseDeviceSessionsReturn {
    data: DeviceSession[] | null
    isPending: boolean
    error: Error | null
    refetch: () => void
}

const cacheDeviceSessions = (deviceSessions: DeviceSession[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("triplit-device-sessions", superjson.stringify(deviceSessions))
}

const getCachedDeviceSessions = () => {
    if (typeof window === "undefined") return null

    const deviceSessions = localStorage.getItem("triplit-device-sessions")

    if (!deviceSessions) return null

    return superjson.parse(deviceSessions) as DeviceSession[]
}

export function useDeviceSessions(): UseDeviceSessionsReturn {
    const isHydrated = useIsHydrated()
    const [deviceSessions, setDeviceSessions] = useState<DeviceSession[] | null>(
        isHydrated ? getCachedDeviceSessions() : null
    )
    const [isPending, setIsPending] = useState(!deviceSessions)
    const [error, setError] = useState<Error | null>(null)

    const refetch = useCallback(async () => {
        setError(null)

        try {
            const deviceSessions = await authClient.multiSession.listDeviceSessions({
                fetchOptions: { throw: true }
            })

            setDeviceSessions(deviceSessions)
            cacheDeviceSessions(deviceSessions)
        } catch (error) {
            console.error(error)
            setError(error as Error)
            setDeviceSessions(null)
        }

        setIsPending(false)
    }, [])

    useEffect(() => {
        refetch()
    }, [refetch])

    const data = useMemo(() => {
        const sessions = deviceSessions || getCachedDeviceSessions()
        return sessions?.filter((session) => session.session.expiresAt > new Date()) || null
    }, [deviceSessions])

    return { data, isPending, error, refetch }
}
