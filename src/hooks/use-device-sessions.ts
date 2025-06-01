/** biome-ignore-all lint/suspicious/noExplicitAny: Flexible */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Flexible */

import { useStore } from "@nanostores/react"
import { $deviceSessions, emptyResponse } from "@/better-auth-persistent/device-sessions"
import { useIsHydrated } from "./use-hydrated"

export function useDeviceSessions() {
    const isHydrated = useIsHydrated()
    const result = useStore($deviceSessions)

    return isHydrated ? result : emptyResponse
}
