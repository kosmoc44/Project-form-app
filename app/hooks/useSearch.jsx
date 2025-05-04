import { useState } from 'react'

export const useSearch = (items = []) => {
    const [search, setSearch] = useState('')

    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
    )

    return {
        search,
        setSearch,
        filteredItems
    }
}