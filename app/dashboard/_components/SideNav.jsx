import { CircleFadingArrowUp, Library, MessageSquareMore, ArrowLeft, Link2 } from "lucide-react"
import { usePathname } from "next/navigation.js"
import Link from "next/link.js"
import { useState } from "react"

function SideNav({ isOpen }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const menuList = [
        {
            id: 1,
            name: "My Forms",
            icon: <Library size={20} />,
            path: '/dashboard'
        },
        {
            id: 2,
            name: "Links",
            icon: <Link2 size={20} />,
            path: '/dashboard/link'
        },
        {
            id: 3,
            name: "Responses",
            icon: <MessageSquareMore size={20} />,
            path: '/dashboard/responses'
        }
    ]
    const path = usePathname()

    return (
        <>
            <div className="w-64 h-svh md:static border-r shadow-sm flex flex-col">
                {menuList.map((item) => (
                    <div key={item.id} className="p-3 border-b">
                        <Link href={item.path}>
                            <div className={`flex items-center gap-2 hover:bg-primary/50 hover:text-white rounded-lg p-3 cursor-pointer
                        ${path == item.path && 'bg-primary/50 text-white'}`}>
                                {item.icon}
                                {item.name}
                            </div>
                        </Link>
                    </div>
                ))}
                <div className="relative md:hidden">
                    <button
                        className="absolute top-4 right-[50%] flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
                        onClick={() => isOpen(false)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default SideNav
