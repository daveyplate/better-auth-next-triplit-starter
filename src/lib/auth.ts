import { triplitAdapter } from "@daveyplate/better-auth-triplit"
import { betterAuth } from "better-auth"
import { multiSession } from "better-auth/plugins"

import { httpClient } from "@/triplit/http-client"

export const auth = betterAuth({
    database: triplitAdapter({
        httpClient,
        debugLogs: false
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [multiSession()]
})
