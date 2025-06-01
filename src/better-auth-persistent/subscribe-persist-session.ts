import type { Session, User } from "better-auth"
import type { AnyAuthClient } from "@/types/any-auth-client"
import { $authClient } from "./auth-client-store"
import { $persistentSession } from "./persistent-session"

type SessionData = { session: Session; user: User }

export function subscribePersistSession(authClient: AnyAuthClient) {
    if (!$authClient.get()) {
        $authClient.set(authClient)
    }

    const persistSession = () => {
        const value = authClient.$store.atoms.session.get()
        const sessionData = value?.data as SessionData | null
        const persistentSessionData = $persistentSession.get()?.data

        if (
            !persistentSessionData ||
            (!sessionData && !value?.error) ||
            (sessionData && sessionData.session.userId === persistentSessionData.session.userId)
        ) {
            $persistentSession.set(value)
        }
    }

    const restoreSession = () => {
        const sessionData = authClient.$store.atoms.session.get()?.data as SessionData | null
        const persistentValue = $persistentSession.get()
        const persistentSessionData = $persistentSession.get()?.data

        if (!persistentSessionData) return

        if (!sessionData || persistentSessionData.user.id !== sessionData.user.id) {
            authClient.$store.atoms.session.set(persistentValue)
        }
    }

    const unbindPersistentSessionListener = $persistentSession.subscribe(() => {
        restoreSession()
    })

    const unbindSessionListener = authClient.$store.atoms.session.subscribe(() => {
        persistSession()
        restoreSession()
    })

    return () => {
        unbindSessionListener()
        unbindPersistentSessionListener()
    }
}
