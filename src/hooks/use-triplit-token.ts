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

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	const token = useMemo(
		() =>
			triplit.token
				? (JSON.parse(JSON.stringify(triplit.vars.$token)) as JSONWebToken)
				: null,
		[connectionOptions]
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
