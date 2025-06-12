import { TriplitClient } from "@triplit/client"
import { isServer } from "@/lib/utils"
import { schema } from "./schema"

export const triplit = new TriplitClient({
    schema,
    serverUrl: process.env.NEXT_PUBLIC_TRIPLIT_DB_URL,
    storage: {
        name: "better-auth-starter",
        type: isServer ? "memory" : "indexeddb"
    },
    autoConnect: false
})
