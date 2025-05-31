import type { Entity } from "@triplit/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { triplit } from "../../triplit/client"
import type { schema } from "../../triplit/schema"

type Todo = Entity<typeof schema, "todos">

export default function Todo({ todo }: { todo: Todo }) {
    return (
        <div className="flex items-center gap-2">
            <Checkbox
                checked={todo.completed}
                onCheckedChange={() =>
                    triplit.update("todos", todo.id, async (entity) => {
                        entity.completed = !todo.completed
                        entity.updatedAt = new Date()
                    })
                }
            />

            {todo.text}

            <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                    triplit.delete("todos", todo.id)
                }}
            >
                ❌
            </Button>
        </div>
    )
}
