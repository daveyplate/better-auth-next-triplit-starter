"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
    const router = useRouter()

    useEffect(() => {
        window.addEventListener("online", router.refresh)

        return () => {
            window.removeEventListener("online", router.refresh)
        }
    }, [router])

    return (
        <main className="flex grow flex-col items-center justify-center gap-8">
            <h2 className="font-bold text-2xl">You are offline</h2>

            <Button onClick={router.refresh}>Refresh</Button>
        </main>
    )
}
