import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { triplit } from "@/triplit/client"
import { useSession } from "./auth-hooks"
import { useTriplitToken } from "./use-triplit-token"

export function useTriplitAuth() {
    const router = useRouter()
    const { payload } = useTriplitToken()
    const { data: sessionData, isPending: sessionPending, refetch: refetchSession } = useSession()

    // biome-ignore lint/correctness/useExhaustiveDependencies: only run on session change
    useEffect(() => {
        if (sessionPending) return

        const startSession = async () => {
            const user = sessionData?.user as
                | {
                      id: string
                      role?: string
                  }
                | undefined

            if (sessionData && user?.id === payload?.sub && user?.role === payload?.role) {
                triplit.updateSessionToken(sessionData.session.token)
                return
            }

            if (triplit.token && sessionData?.user.id !== payload?.sub) {
                await triplit.endSession()

                while (
                    triplit.connectionStatus === "OPEN" ||
                    triplit.connectionStatus === "CLOSING"
                ) {
                    await new Promise((resolve) => requestAnimationFrame(resolve))
                }

                await triplit.clear()
            }

            try {
                await triplit.startSession(
                    sessionData?.session.token || process.env.NEXT_PUBLIC_TRIPLIT_ANON_TOKEN!
                )
            } catch (error) {
                console.error(error)
                toast.error((error as Error).message)
            }
        }

        const unlisten = triplit.onSessionError((error) => {
            console.error(error)
            toast.error(error)
            router.push("/auth/sign-out")
        })

        startSession()

        return () => {
            unlisten()
        }
    }, [sessionData, sessionPending, refetchSession])
}
