"use client"

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "../../components/ui/button"
import { useState } from "react"
import { BriefcaseIcon, FormInputIcon, HomeIcon, InfoIcon, MailIcon, MenuIcon, XIcon } from "lucide-react"
import ModeToggle from './ModeToggle.jsx'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    return (
        <header className=" w-full h-[80px] flex justify-between items-center px-4 md:px-6 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="font-bold text-xl md:text-2xl flex items-center">
                <FormInputIcon className=" w-6 h-6 mr-2" />
                Project Forms
            </div>

            <button
                className=" md:hidden flex items-center justify-center p-2 "
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
            <nav
                className={`${isMenuOpen ? "block shadow-md bg-accent" : "hidden"}
        absolute top-[80px] left-0 w-full z-50 md:static md:flex md:items-center md:gap-6 md:w-auto
        `}
            >
                <ul className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-0">
                    <li className="w-full">
                        <Button variant="underline" className="w-full md:w-auto">
                            <HomeIcon /> Home
                        </Button>
                    </li>
                    <li className="w-full">
                        <Button variant="underline" className="w-full md:w-auto">
                            <InfoIcon /> About
                        </Button>
                    </li>
                    <li className="w-full">
                        <Button variant="underline" className="w-full md:w-auto">
                            <BriefcaseIcon /> Services
                        </Button>
                    </li>
                    <li className="w-full">
                        <Button variant="underline" className="w-full md:w-auto">
                            <MailIcon /> Contact
                        </Button>
                    </li>
                    <li className="w-full text-center">
                        <ModeToggle />
                    </li>
                    <li>
                        <SignedOut>
                            <Button variant="outline" asChild>
                                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" />
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
