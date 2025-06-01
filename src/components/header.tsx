import { GitHubIcon, UserButton } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/60 px-4 py-3 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <svg
                            className="size-5"
                            fill="none"
                            height="45"
                            viewBox="0 0 60 45"
                            width="60"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="fill-black dark:fill-white"
                                clipRule="evenodd"
                                d="M0 0H15V45H0V0ZM45 0H60V45H45V0ZM20 0H40V15H20V0ZM20 30H40V45H20V30Z"
                                fillRule="evenodd"
                            />
                        </svg>

                        <span className="hidden md:block">BETTER-AUTH. STARTER</span>
                    </Link>
                    <Link href="/todos" className="font-medium text-sm hover:underline">
                        Todos
                    </Link>
                    <Link href="/test" className="font-medium text-sm hover:underline">
                        Test
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="https://github.com/daveyplate/better-auth-nextjs-triplit-starter"
                        target="_blank"
                    >
                        <Button variant="outline" size="icon" className="size-8 rounded-full">
                            <GitHubIcon />
                        </Button>
                    </Link>

                    <ModeToggle />
                    <UserButton size="icon" />
                </div>
            </div>
        </header>
    )
}
