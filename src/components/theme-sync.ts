import { useTheme } from "next-themes"
import { useEffect } from "react"
import { useSession } from "@/hooks/use-session"
import { triplit } from "@/triplit/client"

export function ThemeSync() {
    const { theme, setTheme } = useTheme()
    const { data: sessionData, isPending } = useSession()
    const user = sessionData?.user

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
    }, [isPending, user?.theme])

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
