import type { Models, TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import type { AnyAuthClient } from "@/types/any-auth-client"

import {
    type InitTriplitAuthOptions,
    initTriplitAuth
} from "./init-triplit-auth"

export function useTriplitAuth<M extends Models<M>>(
    triplit: TriplitClient<M>,
    authClient: AnyAuthClient,
    options?: InitTriplitAuthOptions
) {
    useEffect(
        () => initTriplitAuth(triplit, authClient, options),
        [triplit, authClient, options]
    )
}
