import { persistentAtom } from "@nanostores/persistent"
import type { Session, User } from "better-auth"
import SuperJSON from "superjson"

type SessionResult = {
    data: { session: Session; user: User } | null
    isPending: boolean
    isRefetching: boolean
    error: Error | null
    refetch: undefined
}

export const $persistentSession = persistentAtom<SessionResult>(
    "session",
    {
        data: null,
        isPending: true,
        isRefetching: true,
        error: null,
        refetch: undefined
    },
    {
        encode: SuperJSON.stringify,
        decode: SuperJSON.parse
    }
)
