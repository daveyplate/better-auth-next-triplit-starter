import type { Models, TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import {
    type InitTriplitAuthOptions,
    initTriplitAuth
} from "./init-triplit-auth"
import { useSession } from "./use-session"

export function useTriplitAuth<M extends Models<M>>(
    triplit: TriplitClient<M>,
    options?: InitTriplitAuthOptions
) {
    const { data: sessionData, isPending } = useSession()

    useEffect(
        () =>
            initTriplitAuth(triplit, {
                ...options,
                sessionData,
                isPending
            }),
        [triplit, options, sessionData, isPending]
    )
}
