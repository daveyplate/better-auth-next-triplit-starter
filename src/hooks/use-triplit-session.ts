import { useMemo } from "react"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import { useConditionalQueryOne } from "./use-conditional-query"

export function useTriplitSession() {
	const { data: sessionData, error: sessionError } = authClient.useSession()
	const { result: user, error: userError } = useConditionalQueryOne(
		triplit,
		sessionData && triplit.query("users").Where("id", "=", sessionData?.user.id)
	)

	const result = useMemo(() => {
		if (sessionError)
			return { data: null, isPending: false, error: sessionError }
		if (userError) return { data: null, isPending: false, error: userError }
		if (!user || !sessionData)
			return { data: null, isPending: true, error: null }

		return {
			data: {
				session: sessionData.session,
				user
			},
			isPending: false,
			error: null
		}
	}, [sessionData, user, sessionError, userError])

	return result
}
