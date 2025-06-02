"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        // global-error must include html and body tags
        <html lang="en">
            <body className="flex min-h-svh flex-col items-center justify-center gap-8">
                <h2 className="font-bold text-2xl">Something went wrong!</h2>

                <Button onClick={() => reset()}>Try again</Button>
            </body>
        </html>
    )
}
