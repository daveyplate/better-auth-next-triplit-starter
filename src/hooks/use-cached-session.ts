"use client"

import type { Session, User } from "better-auth"
import { useCallback, useEffect, useState } from "react"
import superjson from "superjson"
import { useIsHydrated } from "./use-hydrated"

type SessionData = {
    session: Session
    user: User
}

const getCachedSessionData = () => {
    if (typeof window === "undefined") return null

    const activeSession = localStorage.getItem("triplit-session")

    if (activeSession) {
        const sessionData = superjson.parse(activeSession) as SessionData

        if (sessionData.session.expiresAt.getTime() < Date.now()) {
            localStorage.removeItem("triplit-session")
            return null
        }

        return sessionData
    }

    return null
}

const setCachedSessionData = (session: SessionData | null) => {
    if (typeof window === "undefined") return

    if (!session) {
        localStorage.removeItem("triplit-session")
    } else {
        localStorage.setItem("triplit-session", superjson.stringify(session))
    }
}

export function useCachedSession() {
    const isHydrated = useIsHydrated()
    const [data, setData] = useState<SessionData | null>(isHydrated ? getCachedSessionData() : null)
    const [isPending, setIsPending] = useState(!data)

    useEffect(() => {
        setData(getCachedSessionData())
        setIsPending(false)
    }, [])

    const cacheSessionData = useCallback((sessionData: SessionData | null) => {
        setData(sessionData)
        setCachedSessionData(sessionData)
    }, [])

    return { data, cacheSessionData, isPending }
}
