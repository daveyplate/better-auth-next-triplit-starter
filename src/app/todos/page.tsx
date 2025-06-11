"use client"

import { useAuthenticate } from "@daveyplate/better-auth-ui"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConditionalQuery } from "@/hooks/use-conditional-query"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import Todo from "./todo"
import TodoSkeleton from "./todo-skeleton"

function useTodos() {
    // useAuthenticate is a wrapper for useSession that redirects to sign in
    const { data: sessionData } = useAuthenticate()
    const userId = sessionData?.user?.id
    const todosQuery = triplit
        .query("todos")
        .Order("createdAt", "DESC")
        .Where("userId", "=", userId)

    const {
        results: todos,
        error,
        fetching
    } = useConditionalQuery(triplit, userId && todosQuery)

    return { todos, error, fetching }
}

export default function TodosPage() {
    const { data: sessionData } = authClient.useSession()

    const { todos, fetching } = useTodos()
    const [text, setText] = useState("")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!sessionData?.user?.id) return

        if (!text) {
            toast.error("Please enter a todo")
            return
        }

        await triplit.insert("todos", { userId: sessionData.user.id, text })
        setText("")
    }

    return (
        <main className="container mx-auto flex flex-col gap-4 p-safe-or-4 md:p-safe-or-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                    type="text"
                    placeholder="What needs to be done?"
                    value={text}
                    disabled={!sessionData}
                    onChange={(e) => setText(e.target.value)}
                />

                <Button type="submit" disabled={!sessionData}>
                    Add Todo
                </Button>
            </form>

            {fetching && (
                <div>
                    {[...Array(4)].map((_, index) => (
                        <TodoSkeleton key={index} />
                    ))}
                </div>
            )}

            {!fetching && todos?.length === 0 && <p>No todos</p>}

            {!fetching && (
                <div>
                    {todos?.map((todo) => (
                        <Todo key={todo.id} todo={todo} />
                    ))}
                </div>
            )}
        </main>
    )
}
