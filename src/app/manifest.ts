import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Better Auth Triplit Next.js Starter",
		short_name: "Triplit Starter",
		icons: [
			{
				src: "/icons/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable"
			},
			{
				src: "/icons/icon-512x512.png",
				sizes: "512x512",
				type: "image/png"
			}
		],
		theme_color: "#FFFFFF",
		background_color: "#FFFFFF",
		start_url: "/",
		display: "fullscreen",
		orientation: "portrait"
	}
}
