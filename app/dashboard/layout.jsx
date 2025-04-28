"use client"
import { SignedIn } from "@clerk/nextjs"
import React from 'react'
import SideNav from './_components/SideNav.jsx'
import MobileSideNavToggle from './_components/MobileSideNavToggle.jsx'

function DashboardLayout({ children }) {
    return (
        <SignedIn>
            <div className="flex min-h-screen">
                <div className="hidden md:block">
                    <SideNav />
                </div>
                <main className="flex-1 p-4 overflow-x-hidden">
                    {/* Mobile menu toggle - показан только на мобильных */}
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