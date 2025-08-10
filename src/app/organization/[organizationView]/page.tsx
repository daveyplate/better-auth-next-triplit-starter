import { OrganizationView } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((organizationView) => ({
        organizationView
    }))
}

export default async function AuthPage({
    params
}: {
    params: Promise<{ organizationView: string }>
}) {
    const { organizationView } = await params

    return (
        <main className="container self-center p-4 md:p-6">
            <OrganizationView
                classNames={{
                    sidebar: {
                        base: "sticky top-20"
                    }
                }}
                pathname={organizationView}
            />
        </main>
    )
}
