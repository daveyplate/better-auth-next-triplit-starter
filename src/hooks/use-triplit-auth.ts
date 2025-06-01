/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useConnectionStatus } from "@triplit/react"
import { useEffect } from "react"
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

            await triplit.endSession()

            while (triplit.connectionStatus === "OPEN") {
                await new Promise((resolve) => requestAnimationFrame(resolve))
            }

            if (!sessionData) {
                await triplit.clear()
            }

            try {
                await triplit.startSession(
                    sessionData?.session.token || process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN
                )
            } catch (error) {
                console.error("startSession", error)
            }
        }

        startSession()
    }, [sessionPending, sessionData, triplit])

    useEffect(() => {
        triplit.onSessionError((error) => {
            console.error("onSessionError", error)
        })
    }, [triplit])

    useEffect(() => {
        // console.log({ connectionStatus })
        if (connectionStatus !== "OPEN") return

        // refetch()
    }, [connectionStatus])
}
