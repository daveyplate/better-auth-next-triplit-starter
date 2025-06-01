"use client"

import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export default function TestPage() {
	const { data, isPending } = authClient.useSession()

	useEffect(() => {
		console.log({ data, isPending })
	}, [data, isPending])

	return (
		<main className="p-safe-or-4 md:p-safe-or-6">
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</main>
	)
}
