import withSerwistInit from "@serwist/next"
import type { NextConfig } from "next"

const revision = crypto.randomUUID()

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV !== "production",
    additionalPrecacheEntries: [
        { url: "/~offline", revision },
        { url: "/", revision },
        { url: "/todos", revision },
        { url: "/test", revision },
        { url: "/auth/sign-in", revision },
        { url: "/auth/sign-up", revision },
        { url: "/auth/settings", revision }
    ]
})

const nextConfig: NextConfig = {
    /* config options here */
}

export default withSerwist(nextConfig)
