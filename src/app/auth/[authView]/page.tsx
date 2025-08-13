import { AuthView, authViewPaths } from "@daveyplate/better-auth-ui"
import Link from "next/link"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((authView) => ({ authView }))
}

export default async function AuthPage({
    params
}: {
    params: Promise<{ authView: string }>
}) {
    const { authView } = await params

    // **EXAMPLE** SSR route protection for /auth/settings
    // NOTE: This opts /auth/settings out of static rendering
    // It already handles client side protection via useAuthenticate
    // if (authView === "settings") {
    //     const sessionData = await auth.api.getSession({ headers: await headers() })
    //     if (!sessionData) redirect("/auth/sign-in?redirectTo=/auth/settings")
    // }

    return (
        <main className="container flex grow flex-col items-center justify-center gap-4 self-center p-4 md:p-6">
            <AuthView pathname={authView} />

            {["sign-in", "sign-up", "magic-link", "forgot-password"].includes(
                authView
            ) && (
                <p className="text-muted-foreground text-xs">
                    Powered by{" "}
                    <Link
                        className="text-warning underline"
                        href="https://better-auth.com"
                        target="_blank"
                    >
                        better-auth.
                    </Link>
                </p>
            )}
        </main>
    )
}
