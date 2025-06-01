"use client"

import { useAuthenticate } from "@daveyplate/better-auth-ui"
import { Loader2 } from "lucide-react"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useConditionalQuery } from "@/hooks/use-conditional-query"
import { useTriplitToken } from "@/hooks/use-triplit-token"
import { authClient } from "@/lib/auth-client"
import { triplit } from "@/triplit/client"
import Todo from "./todo"

function useTodos() {
	const { data: sessionData } = authClient.useSession()
	const { token } = useTriplitToken()
	const todosQuery = triplit
		.query("todos")
		.Order("createdAt", "DESC")
		.Where("userId", "=", sessionData?.user.id)

	const { results: todos, error, fetching } = useConditionalQuery(triplit, token && todosQuery)

	return { todos, error, fetching }
}

export default function TodosPage() {
	useAuthenticate()
	const { data: sessionData } = authClient.useSession()

	const { todos, fetching } = useTodos()
	const [text, setText] = useState("")

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!sessionData?.user?.id) return

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

			{todos?.length === 0 && <p>No todos</p>}

			<div>
				{todos?.map((todo) => (
					<Todo key={todo.id} todo={todo} />
				))}
			</div>
		</div>
	)
}
