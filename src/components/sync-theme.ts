import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useConditionalQueryOne } from "@/hooks/use-conditional-query"
import { useTriplitSession } from "@/hooks/use-triplit-session"
import { triplit } from "@/triplit/client"

export function SyncTheme() {
    const { data: sessionData } = useTriplitSession()
    const { result: user, fetching } = useConditionalQueryOne(
        triplit,
        sessionData &&
            triplit.query("users").Where(["id", "=", sessionData?.user.id])
    )
    const { theme, setTheme } = useTheme()

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        if (!user) return
        if (theme === user.theme) return

        if (!user.theme) {
            triplit.update("users", user.id, {
                theme,
                updatedAt: new Date()
            })

            return
        }

        setTheme(user.theme)
    }, [fetching, user?.theme])

    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    useEffect(() => {
        if (!user) return
        if (theme === user.theme) return

        triplit.update("users", user.id, {
            theme,
            updatedAt: new Date()
        })
    }, [theme])

    return null
}
