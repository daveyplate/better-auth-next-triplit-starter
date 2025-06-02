import type { ConnectionOptionsChange } from "@triplit/client"
import { useEffect, useMemo, useState } from "react"
import { triplit } from "@/triplit/client"

type JSONWebToken = {
    sub?: string
    email?: string
    role?: string
    iat: number
    exp: number
} & Record<string, unknown>

export function useTriplitToken() {
    const [connectionOptions, setConnectionOptions] =
        useState<ConnectionOptionsChange>()
    const [isReady, setIsReady] = useState(!triplit.awaitReady)

    useEffect(() => {
        triplit.awaitReady?.then(() => setIsReady(true))
    }, [])

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    const token = useMemo(
        () =>
            isReady && triplit.token
                ? (JSON.parse(
                      JSON.stringify(triplit.vars.$token)
                  ) as JSONWebToken)
                : null,
        [connectionOptions, isReady]
    )

    useEffect(
        () =>
            triplit.onConnectionOptionsChange((options) => {
                setTimeout(() => setConnectionOptions(options))
            }),
        []
    )

    return token
}
