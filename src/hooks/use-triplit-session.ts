import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import { useConditionalQueryOne } from "./use-conditional-query"
import { useTriplitToken } from "./use-triplit-token"

export function useTriplitSession() {
	const result = authClient.useSession()
	const sessionData = result?.data
	const token = useTriplitToken()

	const { result: user } = useConditionalQueryOne(
		triplit,
		sessionData &&
			sessionData.user.id === token?.sub &&
			triplit.query("users").Where("id", "=", sessionData.user.id)
	)

	if (user && sessionData) {
		sessionData.user = user
	}

	return result
}
