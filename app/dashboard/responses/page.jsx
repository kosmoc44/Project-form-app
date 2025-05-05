"use client"

import { useState, useEffect } from 'react'
import { db } from '../../../lib/firebase/config'
import { collection, getDocs, doc, updateDoc, arrayRemove } from 'firebase/firestore'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '../../../components/ui/card'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../../components/ui/alert-dialog'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Trash2, Copy } from 'lucide-react'
import { toast } from "sonner"
import { SearchBar } from "../_components/SearchBar"
import { useSearch } from "../../hooks/useSearchResponses"

export default function ResponsesPage() {
    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const { search, setSearch, filteredItems: filteredResponses } = useSearch(responses || [])

    useEffect(() => {
        fetchResponses()
    }, [])

    const fetchResponses = async () => {
        try {
            const formsSnapshot = await getDocs(collection(db, "forms"))
            const allResponses = []

            for (const formDoc of formsSnapshot.docs) {
                const formData = formDoc.data()

                if (formData.responses?.length > 0) {
                    formData.responses.forEach((response, index) => {
                        allResponses.push({
                            formId: formDoc.id,
                            formTitle: formData.title,
                            formDescription: formData.description,
                            responseIndex: index,
                            responseId: `${formDoc.id}-${index}`,
                            answers: response,
                            createdAt: new Date().toLocaleString()
                        })
                    })
                }
            }

            setResponses(allResponses)
        } catch (error) {
            console.error("Error fetching responses:", error)
            toast.error("Failed to load responses")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteResponse = async (formId, responseIndex) => {
        setDeletingId(`${formId}-${responseIndex}`)

        try {
            const formRef = doc(db, "forms", formId)
            await updateDoc(formRef, {
                responses: arrayRemove(responses.find(r =>
                    r.formId === formId && r.responseIndex === responseIndex
                ).answers
                )
            })

            toast.success("Response deleted successfully")
            fetchResponses()
        } catch (error) {
            console.error("Error deleting response:", error)
            toast.error("Failed to delete response")
        } finally {
            setDeletingId(null)
        }
    }

    const handleCopyToClipboard = async () => {
        if (responses.length === 0) {
            toast("There is no data to copy");
            return;
        }

        try {
            await navigator.clipboard.writeText(
                JSON.stringify(responses, null, 2)
            );
            toast.success("The data has been copied!");
        } catch (err) {
            toast.error("Copy error");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                    <div className="flex  items-center gap-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">Responses</h1>
                        <Badge variant="secondary" className="text-xs sm:text-sm mt-1">
                            {responses.length} total
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-3 max-[620px]:flex-col max-[620px]:w-[100%]">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search Responses..."
                    />
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleCopyToClipboard}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy JSON
                    </Button>
                </div>
            </div>

            {filteredResponses?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center border rounded-lg">
                    <h3 className="text-xl font-medium">{search ? 'No matching responses found' : 'No responses yet created'}</h3>
                    <p className="text-muted-foreground max-w-md px-4">
                        {search ? "" : "Responses will appear here once users start submitting your forms"}
                    </p>
                </div>
            ) : (
                <div className="grid">
                    {filteredResponses?.map((response) => (
                        <Card key={response.responseId} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg sm:text-xl line-clamp-2">
                                            {response.formTitle}
                                        </CardTitle>
                                        <CardDescription className="text-sm line-clamp-3">
                                            {response.formDescription}
                                        </CardDescription>
                                        <CardDescription className="text-xs sm:text-sm">
                                            ID: {response.responseId}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-2">
                                        <Badge>
                                            {response.createdAt}
                                        </Badge>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700"
                                                    disabled={deletingId === response.responseId}
                                                >
                                                    {deletingId === response.responseId ? (
                                                        <div className="animate-spin h-3 w-3 border-t-2 border-b-2 border-red-500 rounded-full"></div>
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="max-w-[90%] sm:max-w-md">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this response.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                                                    <Button
                                                        variant={"destructive"}
                                                        onClick={() => handleDeleteResponse(response.formId, response.responseIndex)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="space-y-3">
                                    {Object.entries(response.answers).map(([questionIndex, answer]) => (
                                        <div key={questionIndex} className="border-l-2 sm:border-l-4 border-primary pl-3 py-1">
                                            <h4 className="font-medium text-xs sm:text-sm text-muted-foreground">
                                                Q{parseInt(questionIndex) + 1}
                                            </h4>
                                            {Array.isArray(answer) ? (
                                                <div className="mt-1 flex flex-wrap gap-1 sm:gap-2">
                                                    {answer.map((item, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-sm sm:text-base text-foreground break-words">
                                                    {answer}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}