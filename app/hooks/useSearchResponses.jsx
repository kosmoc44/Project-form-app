import { useState } from 'react'

export const useSearch = (items = []) => {
    const [search, setSearch] = useState('')

    const filteredItems = items.filter(item =>
        item.formTitle?.toLowerCase().includes(search.toLowerCase()) ||
        item.formDescription?.toLowerCase().includes(search.toLowerCase())
    )

    return {
        search,
        setSearch,
        filteredItems
    }
}