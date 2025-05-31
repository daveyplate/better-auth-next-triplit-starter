"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useDeviceSessions } from "@/hooks/use-device-sessions"
import { useTriplitSession } from "@/hooks/use-triplit-session"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"

export function AccountSwitcher() {
    const { data: deviceSessions } = useDeviceSessions()
    const { data: session } = useTriplitSession({ triplit, authClient })

    const setActive = (sessionId: string) => {
        // Empty function that will be called when a session is clicked
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{session?.user?.email || "Select Account"}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuLabel>Device Sessions</DropdownMenuLabel>

                <DropdownMenuSeparator />

                {deviceSessions?.map((deviceSession) => (
                    <DropdownMenuItem
                        key={deviceSession.session.id}
                        onClick={() => setActive(deviceSession.session.id)}
                    >
                        {deviceSession.user?.email || "Unknown User"}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
