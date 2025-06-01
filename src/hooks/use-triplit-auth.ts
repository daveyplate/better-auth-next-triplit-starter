/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import { toast } from "sonner"
import { $persistentSession } from "@/better-auth-persistent/persistent-session"
import { usePersistSession } from "@/better-auth-persistent/use-persist-session"
import type { authClient } from "@/lib/auth-client"
import { useOnlineStatus } from "./use-online-status"

interface UseTriplitAuthOptions {
    triplit: TriplitClient<any>
    authClient: typeof authClient
}

export function useTriplitAuth({ triplit, authClient }: UseTriplitAuthOptions) {
    usePersistSession(authClient)
    const online = useOnlineStatus()

    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    useEffect(() => {
        if (sessionPending) return

        const startSession = async () => {
            if (triplit.token === sessionData?.session.token) return

            await triplit.endSession()
            await new Promise((resolve) => setTimeout(resolve, 100))

            if (!sessionData) {
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

        const unsub = triplit.onSessionError((error) => {
            console.error("onSessionError", error)
        })

        const unsub2 = triplit.onFailureToSyncWrites((error) => {
            console.error("onFailureToSyncWrites", error)
            toast.error("Failed to sync writes, clearing pending changes")
            triplit.clearPendingChangesAll()
        })

        return () => {
            unsub()
            unsub2()
        }
    }, [sessionPending, sessionData, triplit])

    useEffect(() => {
        if (!online) return

        const persistentSession = $persistentSession.get()
        if (persistentSession.optimistic && persistentSession.data) {
            authClient.multiSession.setActive({
                sessionToken: persistentSession.data.session.token
            })
        }
    }, [online])
}
