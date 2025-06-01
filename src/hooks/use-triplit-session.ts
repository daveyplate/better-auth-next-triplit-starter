import { useMemo } from "react"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import { useConditionalQueryOne } from "./use-conditional-query"

export function useTriplitSession() {
    const { data: sessionData, isPending: sessionPending, error } = authClient.useSession()
    const { result: user } = useConditionalQueryOne(
        triplit,
        triplit.token && triplit.query("users").Where("id", "=", sessionData?.user.id)
    )

    const result = useMemo(() => {
        if (user && sessionData) {
            sessionData.user = user
        }

        return { data: sessionData, isPending: sessionPending, error }
    }, [sessionData, user, sessionPending, error])

    return result
}
