"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import SuperJSON from "superjson"
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
		<main className="flex h-screen flex-col items-center justify-center gap-4">
			<h2 className="font-bold text-2xl">Something went wrong!</h2>

			<p className="text-muted-foreground">{error.message}</p>

			<div className="text-xs">{SuperJSON.stringify(error)}</div>

			<Button type="button" onClick={() => reset()}>
				Try again
			</Button>
		</main>
	)
}
