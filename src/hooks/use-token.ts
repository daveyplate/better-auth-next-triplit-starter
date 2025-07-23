import type { Models, TriplitClient } from "@triplit/client"
import { useEffect, useState } from "react"

export function useToken<M extends Models<M>>(triplit: TriplitClient<M>) {
    const [token, setToken] = useState(triplit.token)

    useEffect(
        () => triplit.onConnectionOptionsChange(() => setToken(triplit.token)),
        [triplit]
    )

    return { token }
}
