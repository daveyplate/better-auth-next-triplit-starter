/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import type { TriplitClient } from "@triplit/client"
import { useEffect } from "react"
import { toast } from "sonner"
import { $persistentSession } from "@/better-auth-persistent/persistent-session"
import { usePersistSession } from "@/better-auth-persistent/use-persist-session"
import type { authClient } from "@/lib/auth-client"
import { useOnlineStatus } from "./use-online-status"

interface UseTriplitAuthOptions {
	triplit: TriplitClient<any>
	authClient: typeof authClient
}

export function useTriplitAuth({ triplit, authClient }: UseTriplitAuthOptions) {
	usePersistSession(authClient)
	const online = useOnlineStatus()

	const { data: sessionData, isPending: sessionPending } =
		authClient.useSession()

	useEffect(() => {
		const startSession = async () => {
			if (sessionPending) return

			const token =
				sessionData?.session.token || process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN
			if (triplit.token === token) return

			// Clear local DB when we sign out
			if (!sessionData) await triplit.clear()

			try {
				await triplit.startSession(token)
			} catch (error) {
				console.error(error)
			}
		}

		startSession()

		const unbindOnSessionError = triplit.onSessionError((error) => {
			console.error("onSessionError", error)
		})

		const unbindOnFailureToSyncWrites = triplit.onFailureToSyncWrites(
			(error) => {
				console.error("onFailureToSyncWrites", error)
				toast.error("Failed to sync writes, clearing pending changes")
				triplit.clearPendingChangesAll()
			}
		)

		return () => {
			unbindOnSessionError()
			unbindOnFailureToSyncWrites()
		}
	}, [sessionPending, sessionData, triplit])

	useEffect(() => {
		if (!online) return

		const persistentSession = $persistentSession.get()
		if (persistentSession.optimistic && persistentSession.data) {
			authClient.multiSession.setActive({
				sessionToken: persistentSession.data.session.token
			})
		}
	}, [online])
}
