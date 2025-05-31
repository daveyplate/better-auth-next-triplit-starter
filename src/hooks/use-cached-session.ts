"use client"

import type { Session } from "better-auth"
import { useCallback, useEffect, useState } from "react"
import superjson from "superjson"

const getCachedSession = () => {
    if (typeof window === "undefined") return null

    const activeSession = localStorage.getItem("triplit-session")

    if (activeSession) {
        const session = superjson.parse(activeSession) as Session

        if (session.expiresAt.getTime() < Date.now()) {
            localStorage.removeItem("triplit-session")
            return null
        }

        return session
    }

    return null
}

const setCachedSession = (session: Session | null) => {
    if (typeof window === "undefined") return

    if (!session) {
        localStorage.removeItem("triplit-session")
    } else {
        localStorage.setItem("triplit-session", superjson.stringify(session))
    }
}

export function useCachedSession() {
    const [session, setSession] = useState<Session | null>(getCachedSession())
    const [isPending, setIsPending] = useState(!session)

    useEffect(() => {
        setSession(getCachedSession())
        setIsPending(false)
    }, [])

    const cacheSession = useCallback((session: Session | null) => {
        setSession(session)
        setCachedSession(session)
    }, [])

    return { session, cacheSession, isPending }
}
