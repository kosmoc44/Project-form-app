"use client"
import { UserButton } from "@clerk/nextjs"
import { Button } from "../../../components/ui/button"
import { Bell, Menu } from "lucide-react"

export default function DashboardHeader({ onMenuToggle }) {
    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onMenuToggle}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    )
}