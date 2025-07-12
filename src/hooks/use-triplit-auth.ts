import type { Models, TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import {
    type InitTriplitAuthOptions,
    initTriplitAuth
} from "./init-triplit-auth"
import { useTriplitSession } from "./use-triplit-session"

export function useTriplitAuth<M extends Models<M>>(
    triplit: TriplitClient<M>,
    options?: InitTriplitAuthOptions
) {
    const { data: sessionData, isPending } = useTriplitSession()

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
