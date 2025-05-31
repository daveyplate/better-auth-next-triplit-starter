"use client"

import { useEffect } from "react"
import { useTriplitSession } from "@/hooks/use-triplit-session"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export default function TestPage() {
    const { data, isPending } = useTriplitSession({ triplit, authClient })

    useEffect(() => {
        console.log({ data, isPending })
    }, [data, isPending])

    return (
        <>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <pre>{isPending ? "Loading..." : "Loaded"}</pre>
        </>
    )
}
