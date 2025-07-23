import { useSession as usePersistentSession } from "@daveyplate/better-auth-persistent"
import { useQueryOne } from "@triplit/react"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export function useSession() {
    const result = usePersistentSession(authClient)
    const sessionData = result?.data

    const { result: user } = useQueryOne(
        triplit,
        triplit.query("users").Where("id", "=", sessionData?.user.id),
        {
            enabled: !!sessionData
        }
    )

    if (user && sessionData) {
        sessionData.user = user
    }

    return result
}
