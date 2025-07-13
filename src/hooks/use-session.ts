import { useSession as usePersistentSession } from "@daveyplate/better-auth-persistent"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import { useConditionalQueryOne } from "./use-conditional-query"

export function useSession() {
    const result = usePersistentSession(authClient)
    const sessionData = result?.data

    const { result: user } = useConditionalQueryOne(
        triplit,
        sessionData &&
            triplit.query("users").Where("id", "=", sessionData.user.id)
    )

    if (user && sessionData) {
        sessionData.user = user
    }

    return result
}
