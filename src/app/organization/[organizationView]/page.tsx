import { OrganizationView } from "@daveyplate/better-auth-ui"
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(organizationViewPaths).map((organizationView) => ({
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
