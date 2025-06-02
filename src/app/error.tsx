"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
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
        <main className="flex grow flex-col items-center justify-center gap-8">
            <h2 className="font-bold text-2xl">Something went wrong!</h2>

            <Button onClick={() => reset()}>Try again</Button>
        </main>
    )
}
