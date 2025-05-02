"use client"
import { SignedIn } from "@clerk/nextjs"
import React from 'react'
import SideNav from './_components/SideNav.jsx'
import MobileSideNavToggle from './_components/MobileSideNavToggle.jsx'

function DashboardLayout({ children }) {
    return (
        <SignedIn>
            <div className="flex min-h-[100svh]">
                <div className="hidden md:block h-[100svh] sticky top-0">
                    <SideNav />
                </div>
                <main className="flex-1 p-4 overflow-x-hidden">
                    <div className="md:hidden mb-4">
                        <MobileSideNavToggle />
                    </div>
                    {children}
                </main>
            </div>
        </SignedIn>
    )
}

export default DashboardLayout