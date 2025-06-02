/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import type { AnyAuthClient } from "@/types/any-auth-client"
import {
	type SetupTriplitAuthOptions,
	setupTriplitAuth
} from "./setup-triplit-auth"

export function useTriplitAuth(
	triplit: TriplitClient<any>,
	authClient: AnyAuthClient,
	options?: SetupTriplitAuthOptions
) {
	useEffect(
		() => setupTriplitAuth(triplit, authClient, options),
		[triplit, authClient, options]
	)
}
