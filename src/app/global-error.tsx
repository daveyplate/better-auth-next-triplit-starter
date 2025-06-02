"use client"
import SuperJSON from "superjson"
import { Button } from "@/components/ui/button"

// Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		// global-error must include html and body tags
		<html lang="en">
			<body>
				<div className="flex h-screen flex-col items-center justify-center gap-4">
					<h2 className="font-bold text-2xl">Something went wrong!</h2>

					<p className="text-muted-foreground">{error.message}</p>

					<div>{SuperJSON.stringify(error)}</div>

					<Button type="button" onClick={() => reset()}>
						Try again
					</Button>
				</div>
			</body>
		</html>
	)
}
