import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function TodoSkeleton() {
	return (
		<div className="flex items-center gap-2">
			{/* Checkbox skeleton */}
			<Skeleton className="h-4 w-4 rounded" />

			{/* Text skeleton */}
			<Skeleton className="h-4 w-32" />

			<Button size="icon" variant="link" disabled />
		</div>
	)
}
