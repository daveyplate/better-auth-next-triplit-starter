import { AccountView } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((view) => ({
        accountView: view
    }))
}

export default async function AuthPage({
    params
}: {
    params: Promise<{ accountView: string }>
}) {
    const { accountView } = await params

    // **EXAMPLE** SSR route protection for /auth/settings
    // NOTE: This opts /auth/settings out of static rendering
    // It already handles client side protection via useAuthenticate
    // if (pathname === "settings") {
    //     const sessionData = await auth.api.getSession({ headers: await headers() })
    //     if (!sessionData) redirect("/auth/sign-in?redirectTo=/auth/settings")
    // }

    return (
        <main className="container self-center p-4 md:p-6">
            <AccountView
                classNames={{
                    sidebar: {
                        base: "sticky top-20"
                    }
                }}
                pathname={accountView}
            />
        </main>
    )
}
