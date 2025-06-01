/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import type { authClient } from "@/lib/auth-client"

interface UseTriplitAuthOptions {
    triplit: TriplitClient<any>
    authClient: typeof authClient
}

export function useTriplitAuth({ triplit, authClient }: UseTriplitAuthOptions) {
    // usePersistSession(authClient)

    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    useEffect(() => {
        if (sessionPending) return

        const startSession = async () => {
            if (!sessionData) {
                await triplit.endSession()
                await triplit.clear()
            }

            console.log("start session", { sessionData })
            await triplit.startSession(
                sessionData?.session.token || process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN
            )
        }

        startSession()
    }, [sessionPending, sessionData, triplit])
}
