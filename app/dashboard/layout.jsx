"use client"
import { SignedIn } from "@clerk/nextjs"
import React from 'react'
import SideNav from './_components/SideNav.jsx'

function DashboardLayout({ children }) {
    return (
        <SignedIn>
            <div>
                <div className="md:w-64 absolute">
                    <SideNav />
                </div>
                <div className="md:ml-64">
                    {children}
                </div>
            </div>
        </SignedIn>
    )
}

export default DashboardLayout
