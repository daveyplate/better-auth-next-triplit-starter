import type {
	FetchResult,
	Models,
	SchemaQuery,
	SubscriptionOptions,
	SubscriptionSignalPayload,
	TriplitClient
} from "@triplit/client"
import type { WorkerClient } from "@triplit/client/worker-client"
import { createStateSubscription } from "@triplit/react"
import { useCallback, useMemo, useSyncExternalStore } from "react"

export function useConditionalQuery<
	M extends Models<M>,
	Q extends SchemaQuery<M>
>(
	client: TriplitClient<M> | WorkerClient<M>,
	query?: Q | false | null | "" | 0,
	options?: Partial<SubscriptionOptions> & { disabled?: boolean }
) {
	const stringifiedQuery = !options?.disabled && query && JSON.stringify(query)
	const localOnly = !!options?.localOnly

	const defaultValue: SubscriptionSignalPayload<M, Q> = {
		results: undefined,
		fetching: true,
		fetchingLocal: false,
		fetchingRemote: false,
		error: undefined
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: prevent infinite re-renders
	const [subscribe, snapshot] = useMemo(
		() =>
			stringifiedQuery
				? createStateSubscription(client, query, {
						...options
					})
				: [() => () => {}, () => defaultValue],
		[stringifiedQuery, localOnly]
	)

	const getServerSnapshot = useCallback(() => snapshot(), [snapshot])
	return useSyncExternalStore(subscribe, snapshot, getServerSnapshot)
}

type useConditionalQueryOnePayload<
	M extends Models<M>,
	Q extends SchemaQuery<M>
> = Omit<SubscriptionSignalPayload<M, Q>, "results"> & {
	result: FetchResult<M, Q, "one">
}

export function useConditionalQueryOne<
	M extends Models<M>,
	Q extends SchemaQuery<M>
>(
	client: TriplitClient<M> | WorkerClient<M>,
	query?: Q | false | null | "" | 0,
	options?: Partial<SubscriptionOptions> & { disabled?: boolean }
): useConditionalQueryOnePayload<M, Q> {
	const { fetching, fetchingLocal, fetchingRemote, results, error } =
		useConditionalQuery(
			client,
			query ? ({ ...query, limit: 1 } as Q) : query,
			options
		)

	const result = useMemo(() => {
		return results?.[0] ?? null
	}, [results])

	return { fetching, fetchingLocal, fetchingRemote, result, error }
}
