import { Schema as S } from "@triplit/client"
import { authSchema } from "./auth-schema"

const isUid = ["userId", "=", "$token.sub"] as const

/**
 * Define your schema here. After:
 * - Pass your schema to your Triplit client
 * - Push your schema to your Triplit server with 'triplit schema push'
 *
 * For more information about schemas, see the docs: https://www.triplit.dev/docs/schemas
 */
export const schema = S.Collections({
    ...authSchema,
    todos: {
        schema: S.Schema({
            id: S.Id(),
            userId: S.String(),
            text: S.String(),
            completed: S.Boolean({ default: false }),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        permissions: {
            authenticated: {
                read: {
                    filter: [isUid]
                },
                insert: {
                    filter: [isUid]
                },
                update: {
                    filter: [isUid]
                },
                postUpdate: {
                    filter: [
                        isUid,
                        ["updatedAt", ">", "$prev.updatedAt"],
                        ["createdAt", "=", "$prev.createdAt"]
                    ]
                },
                delete: {
                    filter: [isUid]
                }
            }
        }
    }
})
