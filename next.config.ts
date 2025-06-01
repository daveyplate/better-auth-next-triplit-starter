import withSerwistInit from "@serwist/next"
import type { NextConfig } from "next"

const revision = crypto.randomUUID()

const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV !== "production",
    additionalPrecacheEntries: [{ url: "/", revision }]
})

const nextConfig: NextConfig = {
    /* config options here */
}

export default withSerwist(nextConfig)
