/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useConnectionStatus } from "@triplit/react"
import { useEffect } from "react"
import { $persistentSession } from "@/better-auth-persistent/persistent-session"
import { usePersistSession } from "@/better-auth-persistent/use-persist-session"
import type { authClient } from "@/lib/auth-client"

interface UseTriplitAuthOptions {
    triplit: TriplitClient<any>
    authClient: typeof authClient
}

export function useTriplitAuth({ triplit, authClient }: UseTriplitAuthOptions) {
    usePersistSession(authClient)
    const connectionStatus = useConnectionStatus(triplit)

    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    useEffect(() => {
        if (sessionPending) return

        const startSession = async () => {
            if (triplit.token === sessionData?.session.token) return

            if (!sessionData) {
                await triplit.endSession()
                await triplit.clear()
            }

            try {
                await triplit.startSession(
                    sessionData?.session.token || process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN
                )
            } catch (error) {
                console.error(error)
            }
        }

        startSession()
    }, [sessionPending, sessionData, triplit])

    useEffect(() => {
        const unsub = triplit.onSessionError((error) => {
            console.error("onSessionError", error)
        })

        return () => {
            unsub()
        }
    }, [triplit])

    useEffect(() => {
        if (connectionStatus !== "OPEN") return

        // Call SetActive on session when we reconnect
        const persistentSession = $persistentSession.get()
        if (persistentSession.optimistic && persistentSession.data) {
            authClient.multiSession.setActive({
                sessionToken: persistentSession.data.session.token
            })
        }
    }, [connectionStatus])
}
