import { subscribePersistSession } from "@daveyplate/better-auth-persistent"
import type { SessionError, TriplitClient } from "@triplit/client"
import type { Session, User } from "better-auth"
import type { AnyAuthClient } from "@/types/any-auth-client"

type SessionData = {
	session: Session
	user: User
}

export type SetupTriplitAuthOptions = {
	anonToken?: string
	/** @default true */
	persistent?: boolean
	onSessionError?: (error: SessionError) => void
}

export function setupTriplitAuth(
	// biome-ignore lint/suspicious/noExplicitAny: ignore
	triplit: TriplitClient<any>,
	authClient: AnyAuthClient,
	{ anonToken, persistent = true, onSessionError }: SetupTriplitAuthOptions = {}
) {
	const unbindPersistSession = persistent
		? subscribePersistSession(authClient)
		: undefined

	const startSession = async (sessionData: SessionData | null) => {
		const token =
			sessionData?.session.token ||
			anonToken ||
			process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN!
		if (triplit.token === token) return

		// Clear local DB when we sign out
		if (!sessionData) {
			await triplit.clear()
		}

		// Update session token if it's the same user and role
		if (
			sessionData &&
			triplit.vars.$token.sub === sessionData.user.id &&
			// biome-ignore lint/suspicious/noExplicitAny: ignore
			triplit.vars.$token.role === (sessionData.user as any).role
		) {
			triplit.updateSessionToken(token)
			return
		}

		try {
			await triplit.startSession(token)
		} catch (error) {
			console.error(error)
		}
	}

	const unbindOnSessionChange = authClient.$store.atoms.session.subscribe(
		(result) => {
			if (result.isPending) return

			startSession(result.data)
		}
	)

	const unbindOnSessionError = triplit.onSessionError((error) => {
		if (onSessionError) {
			onSessionError(error)
		} else {
			console.error("onSessionError", error)
		}
	})

	const unbindOnFailureToSyncWrites = triplit.onFailureToSyncWrites((error) => {
		console.error("onFailureToSyncWrites", error)
		triplit.clearPendingChangesAll()
	})

	return () => {
		unbindPersistSession?.()
		unbindOnSessionChange()
		unbindOnSessionError()
		unbindOnFailureToSyncWrites()
	}
}
