import { TriplitClient } from "@triplit/client"
import { schema } from "./schema"

export const triplit = new TriplitClient({
    schema,
    serverUrl: process.env.NEXT_PUBLIC_TRIPLIT_DB_URL,
    storage: {
        // name: "better-auth-starter",
        type: typeof window !== "undefined" ? "memory" : "memory"
    },
    autoConnect: false
})
