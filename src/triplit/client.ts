import { TriplitClient } from "@triplit/client"
import { schema } from "./schema"

export const triplit = new TriplitClient({
    schema,
    serverUrl: process.env.NEXT_PUBLIC_TRIPLIT_DB_URL,
    autoConnect: false
})
