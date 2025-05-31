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
    const { data: cachedSessionData } = useCachedSession()
    const { data: sessionData, isPending: sessionPending } = authClient.useSession()

    const { result: user } = useConditionalQueryOne(
        triplit,
        triplit.token && triplit.query("users")
    )

    const data = useMemo(() => {
        const data = cachedSessionData || sessionData
        if (data && data.session.userId === user?.id) {
            data.user = user
        }

        return data
    }, [cachedSessionData, sessionData, user])

    return { data, isPending: !data && sessionPending, error: null }
}
