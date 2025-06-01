import { $deviceSessions } from "./device-sessions"
import { $persistentSession } from "./persistent-session"

export async function setActiveSession({ sessionToken }: { sessionToken: string }) {
    const deviceSessions = $deviceSessions.get()

    if (!deviceSessions.data) return

    const session = deviceSessions.data.find((session) => session.session.token === sessionToken)

    if (!session)
        throw {
            error: {
                message: "Invalid session token",
                code: "INVALID_SESSION_TOKEN"
            }
        }

    $persistentSession.set({
        data: session,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: undefined
    })
}
