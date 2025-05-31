import type { Session } from "better-auth"
import type { User } from "better-auth/types"
import { useCallback, useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

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

export function useDeviceSessions(): UseDeviceSessionsReturn {
    const [data, setData] = useState<DeviceSession[] | null>(null)
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchDeviceSessions = useCallback(async () => {
        try {
            setError(null)

            const deviceSessions = await authClient.multiSession.listDeviceSessions({
                fetchOptions: { throw: true }
            })

            setData(deviceSessions)
        } catch (error) {
            console.error(error)
            setError(error as Error)
            setData(null)
        } finally {
            setIsPending(false)
        }
    }, [])

    useEffect(() => {
        fetchDeviceSessions()
    }, [fetchDeviceSessions])

    const refetch = useCallback(() => {
        fetchDeviceSessions()
    }, [fetchDeviceSessions])

    return { data, isPending, error, refetch }
}
