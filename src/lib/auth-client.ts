import {
    inferAdditionalFields,
    magicLinkClient,
    multiSessionClient,
    organizationClient
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient(),
        multiSessionClient(),
        organizationClient(),
        inferAdditionalFields<typeof auth>()
    ]
})
