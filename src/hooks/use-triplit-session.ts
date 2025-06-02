import { useEffect, useMemo, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import { useConditionalQueryOne } from "./use-conditional-query"

export function useTriplitSession() {
	const {
		data: sessionData,
		isPending: sessionPending,
		error: sessionError
	} = authClient.useSession()
	const [onRemoteFulfilled, setOnRemoteFulfilled] = useState<string>()
	const { result: user, error: userError } = useConditionalQueryOne(
		triplit,
		sessionData &&
			triplit.query("users").Where("id", "=", sessionData?.user.id),
		{
			onRemoteFulfilled: () => setOnRemoteFulfilled(sessionData?.user.id)
		}
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore
	useEffect(() => {
		setOnRemoteFulfilled(undefined)
	}, [sessionData?.user.id])

	const result = useMemo(() => {
		if (!sessionData && !sessionPending)
			return { data: null, user: null, isPending: false, error: sessionError }
		if (userError)
			return { data: null, user: null, isPending: false, error: userError }
		if (sessionData && onRemoteFulfilled === sessionData.user.id && !user)
			return {
				data: null,
				user: null,
				isPending: true,
				error: new Error("User not found")
			}
		if (!user || !sessionData)
			return { data: null, user: null, isPending: true, error: null }

		return {
			data: {
				session: sessionData.session,
				user
			},
			user,
			isPending: false,
			error: null
		}
	}, [
		sessionData,
		user,
		sessionError,
		userError,
		sessionPending,
		onRemoteFulfilled
	])

	return result
}
