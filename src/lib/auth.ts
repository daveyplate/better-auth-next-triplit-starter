import { triplitAdapter } from "@daveyplate/better-auth-triplit"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { apiKey, multiSession, organization } from "better-auth/plugins"
import { httpClient } from "@/triplit/http-client"

export const auth = betterAuth({
    database: triplitAdapter({
        httpClient,
        debugLogs: false
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            theme: {
                type: "string",
                required: false
            }
        }
    },
    plugins: [
        apiKey({ enableMetadata: true }),
        multiSession(),
        nextCookies(),
        organization()
    ]
})
