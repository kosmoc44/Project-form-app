"use client"

import CreateForm from './_components/CreateForm'
import { useFirestoreCollectionData } from "reactfire"
import { collection, deleteDoc, doc } from "firebase/firestore"
import { db } from '../../lib/firebase/config'
import Link from "next/link"
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import { MoreVertical, Trash2, Eye } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import { toast } from "sonner"
import { useState } from "react"
import { Badge } from "../../components/ui/badge"
import { SearchBar } from "./_components/SearchBar"
import { useSearch } from '../hooks/useSearch'

function Dashboard() {
    const formsCollection = collection(db, "forms")
    const { data: forms, status } = useFirestoreCollectionData(formsCollection, {
        idField: "id"
    })
    const [selectedFormId, setSelectedFormId] = useState(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const { search, setSearch, filteredItems: filteredForms } = useSearch(forms || [])

    const handleDeleteForm = async () => {
        if (!selectedFormId) return

        try {
            await deleteDoc(doc(db, "forms", selectedFormId))
            toast.success("Form deleted successfully")
        } catch (error) {
            console.error("Error deleting form:", error)
            toast.error("Failed to delete form")
        } finally {
            setIsDeleteDialogOpen(false)
            setSelectedFormId(null)
        }
    }

    if (status === 'loading') {
        return (
            <div className="p-4 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Skeleton className="h-10 w-52" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="grid gap-4 sm:gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-10">
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this form? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            variant={"destructive"}
                            onClick={handleDeleteForm}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="font-bold text-2xl sm:text-3xl">Forms</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search forms..."
                    />
                    <CreateForm />
                </div>
            </div>

            {(filteredForms?.length === 0) ? (
                <div className="text-center py-12 border rounded-lg">
                    <p className="text-gray-500">
                        {search ? "No matching forms found" : "No forms created yet"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6">
                    {filteredForms?.map(form => (
                        <div key={form.id} className="border p-4 sm:p-6 rounded-lg hover:shadow-md group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{form.title}</h3>
                                    <p className="text-gray-600">{form.description}</p>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={`dashboard/forms/${form.id}`}
                                                className="flex items-center cursor-pointer"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Fill form
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setSelectedFormId(form.id)
                                                setIsDeleteDialogOpen(true)
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center flex-col gap-3">
                                    <Badge variant="secondary">
                                        {form.questions.length} questions
                                    </Badge>
                                    <Badge variant="secondary">
                                        {form.responses?.length || 0} responses
                                    </Badge>
                                </div>
                                <Badge>
                                    Created: {form.createdAt?.toDate().toLocaleDateString()}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard
