/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import type { authClient } from "@/lib/auth-client"
import { useCachedSession } from "./use-cached-session"

interface UseTriplitAuthOptions {
    triplit: TriplitClient<any>
    authClient: typeof authClient
}

export function useTriplitAuth({ triplit, authClient }: UseTriplitAuthOptions) {
    const {
        data: cachedSessionData,
        cacheSessionData,
        isPending: cachedSessionPending
    } = useCachedSession()

    const {
        data: sessionData,
        isPending: sessionPending,
        error: sessionError
    } = authClient.useSession()

    useEffect(() => {
        if (sessionPending) return

        // If there is no session data, clear the session cache
        if (!sessionData) {
            if (sessionError) return

            cacheSessionData(null)
            return
        }

        // Only cache the current session if we don't have one or it is the same user ID
        if (!cachedSessionData || sessionData.session.userId === cachedSessionData.user.id) {
            cacheSessionData(sessionData)
        } else {
            // AuthClient - SetActiveUser
        }
    }, [cachedSessionData, sessionPending, sessionData, sessionError])

    useEffect(() => {
        if (cachedSessionPending) return

        const startSession = async () => {
            if (!cachedSessionData) {
                await triplit.endSession()
                await triplit.clear()
            }

            await triplit.startSession(
                cachedSessionData?.session.token || process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN
            )
        }

        startSession()
    }, [cachedSessionPending, cachedSessionData, triplit])
}
