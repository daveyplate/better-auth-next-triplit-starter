"use client"

import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"

export default function TestPage() {
	const { data, isPending } = authClient.useSession()

	useEffect(() => {
		console.log({ data, isPending })
	}, [data, isPending])

	return (
		<>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</>
	)
}
