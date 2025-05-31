"use client"

import { useAuthenticate } from "@daveyplate/better-auth-ui"
import { Loader2 } from "lucide-react"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConditionalQuery } from "@/hooks/use-conditional-query"
import { triplit } from "@/triplit/client"
import Todo from "./todo"

function useTodos() {
    const todosQuery = triplit.query("todos").Order("createdAt", "DESC")
    const { results: todos, error, fetching } = useConditionalQuery(triplit, todosQuery)

    return { todos, error, fetching }
}

export default function TodosPage() {
    const { data: sessionData } = useAuthenticate()
    const [text, setText] = useState("")
    const { todos, fetching } = useTodos()

    const handleSubmit = async (e: FormEvent) => {
        if (!sessionData?.user?.id) return
        e.preventDefault()
        await triplit.insert("todos", { userId: sessionData.user.id, text })
        setText("")
    }

    if (fetching) return <Loader2 className="mx-auto my-auto animate-spin" />

    return (
        <div className="container mx-auto flex flex-col gap-4 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="What needs to be done?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <Button type="submit" disabled={!text}>
                    Add Todo
                </Button>
            </form>

            <div>
                {todos?.map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                ))}
            </div>
        </div>
    )
}
