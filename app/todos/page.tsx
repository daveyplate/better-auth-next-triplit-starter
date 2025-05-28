"use client"

import { useQuery } from "@triplit/react"
import { Loader2 } from "lucide-react"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { triplit } from "@/triplit/client"
import Todo from "./todo"

function useTodos() {
    const todosQuery = triplit.query("todos").Order("createdAt", "DESC")
    const { results: todos, error, fetching } = useQuery(triplit, todosQuery)

    return { todos, error, fetching }
}

export default function App() {
    const [text, setText] = useState("")
    const { todos, fetching } = useTodos()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await triplit.insert("todos", { text })
        setText("")
    }

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

            {fetching && <Loader2 className="animate-spin" />}

            <div>
                {todos?.map((todo) => (
                    <Todo key={todo.id} todo={todo} />
                ))}
            </div>
        </div>
    )
}
