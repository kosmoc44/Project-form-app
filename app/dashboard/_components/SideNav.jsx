import { ChartLine, CircleFadingArrowUp, Library, MessageSquareMore } from "lucide-react"
import { Button } from "../../../components/ui/button.jsx"
import { usePathname } from "next/navigation.js"
import Link from "next/link.js"

function SideNav() {
    const menuList = [
        {
            id: 1,
            name: "My Forms",
            icon: <Library />,
            path: '/dashboard'
        },
        {
            id: 2,
            name: "Responses",
            icon: <MessageSquareMore />,
            path: '/dashboard/responses'
        },
        {
            id: 3,
            name: "Analytics",
            icon: <ChartLine />,
            path: '/dashboard/analytics'
        },
        {
            id: 4,
            name: "Upgrade",
            icon: <CircleFadingArrowUp />,
            path: '/dashboard/upgrade'
        },
    ]
    const path = usePathname()


    return (
        <>
            <div className="h-screen shadow-md border">
                {menuList.map((item) => (
                    <div key={item.id} className="p-3 border-b">
                        <Link href={item.path}>
                            <div className={`flex items-center gap-2 hover:bg-primary hover:text-white rounded-lg p-3 cursor-pointer
                            ${path == item.path && 'bg-primary text-white'}`}>
                                {item.icon}
                                {item.name}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SideNav
