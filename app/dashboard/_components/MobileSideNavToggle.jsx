"use client"
import { useState } from 'react'
import { Button } from "../../../components/ui/button"
import { ArrowLeft, PanelLeft, X } from "lucide-react"
import SideNav from './SideNav'

const MobileSideNavToggle = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden"
            >
                {isOpen ? <X /> : <PanelLeft />}
            </Button>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-20 left-0 h-screen w-64 bg-white z-50 shadow-lg">
                        <SideNav isOpen={setIsOpen} />
                    </div>
                </>
            )}
        </>
    )
}

export default MobileSideNavToggle