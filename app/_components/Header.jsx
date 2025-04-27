"use client"

import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"

function Header() {
    const { user, isSignedIn } = useUser()
    return (
        <div className=" p-5 border shadow-sm">
            <div className="flex items-center justify-between">
                <Image src={'/logo.svg'} alt="logo" width={80} height={50} />
                {isSignedIn ?
                    <div className="flex items-center gap-5">
                        <Link href={'/dashboard'}>
                            <Button variant={"outline"}>
                                Dashboard
                            </Button>
                        </Link>
                        <UserButton />
                    </div> :
                    <SignInButton>
                        <Button variant={"outline"}>Sign In</Button>
                    </SignInButton>
                }
            </div>
        </div>
    )
}

export default Header
