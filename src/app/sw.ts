import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { ExpirationPlugin, NetworkOnly, Serwist } from "serwist"

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        // Change this attribute's name to your `injectionPoint`.
        // `injectionPoint` is an InjectManifest option.
        // See https://serwist.pages.dev/docs/build/configuring
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
    }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            matcher: /\/api\/auth\/.*/,
            handler: new NetworkOnly({
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 16,
                        maxAgeSeconds: 24 * 60 * 60
                    })
                ],
                networkTimeoutSeconds: 10
            })
        },
        ...defaultCache
    ],
    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher({ request }) {
                    return request.destination === "document"
                }
            }
        ]
    }
})

const urlsToPrecache = [
    "/",
    "/todos",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/settings"
] as const

self.addEventListener("install", (event) => {
    const requestPromises = Promise.all(
        urlsToPrecache.map((entry) => {
            return serwist.handleRequest({ request: new Request(entry), event })
        })
    )

    event.waitUntil(requestPromises)
})

serwist.addEventListeners()
