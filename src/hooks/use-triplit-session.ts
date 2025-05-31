/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useMemo } from "react"

import type { authClient } from "@/lib/auth-client"
import { useCachedSession } from "./use-cached-session"
import { useConditionalQueryOne } from "./use-conditional-query"

interface UseTriplitAuthOptions {
    triplit: TriplitClient<any>
    authClient: typeof authClient
}

export function useTriplitSession({ triplit, authClient }: UseTriplitAuthOptions) {
    const { session: cachedSession } = useCachedSession()
    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    const {
        result: user,
        fetching,
        error
    } = useConditionalQueryOne(triplit, triplit.token && triplit.query("users"))

    const session = cachedSession || sessionData?.session
    const isPending = (session && fetching) || (!session && sessionPending)

    const data = useMemo(() => {
        if (!session || !user) return null
        if (session.userId !== user.id) return null

        return { session, user }
    }, [session, user])

    if (error) {
        return { data: null, isPending: false, error: error as Error }
    }

    if (!session || !user) {
        return { data: null, isPending, error: null }
    }

    return { data, isPending: false, error: null }
}
