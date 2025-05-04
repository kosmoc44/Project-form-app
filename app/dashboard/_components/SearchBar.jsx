"use client"

import { Input } from "../../../components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "../../../components/ui/button"

export const SearchBar = ({ value, onChange, placeholder }) => {
    const handleChange = (e) => {
        onChange?.(e.target.value)
    }
    return (
        <div className="relative w-full">
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-8"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            {value && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={() => onChange?.('')}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}