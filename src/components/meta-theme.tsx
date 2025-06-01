import { useTheme } from "next-themes"
import { useEffect } from "react"

const themeColors = {
    light: "oklch(1 0 0)",
    dark: "oklch(0.145 0 0)"
} as Record<string, string>

export default function MetaTheme() {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        if (!resolvedTheme) return

        const metaThemeColor = document.querySelector("meta[name=theme-color]")
        metaThemeColor!.setAttribute("content", themeColors[resolvedTheme])
    }, [resolvedTheme])

    return null
}
