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
    AlertDialogAction,
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
import { MessageSquare, ClipboardList, FileText, Trash2, Copy } from 'lucide-react'
import { toast } from "sonner"

export default function ResponsesPage() {
    const [responses, setResponses] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

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
                            responseIndex: index, // Добавляем индекс ответа
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
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Responses</h1>
                    <Badge variant="secondary" className="text-sm">
                        {responses.length} total
                    </Badge>
                </div>
                <Button variant="outline" onClick={handleCopyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy JSON
                </Button>
            </div>

            {responses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-medium">No responses yet</h3>
                    <p className="text-muted-foreground">
                        Responses will appear here once users start submitting your forms
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {responses.map((response) => (
                        <Card key={response.responseId} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{response.formTitle}</CardTitle>
                                        <CardDescription className="mt-1">
                                            Response ID: {response.responseId}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {response.createdAt}
                                        </Badge>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700"
                                                    disabled={deletingId === response.responseId}
                                                >
                                                    {deletingId === response.responseId ? (
                                                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-500 rounded-full"></div>
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this response.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={() => handleDeleteResponse(response.formId, response.responseIndex)}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(response.answers).map(([questionIndex, answer]) => (
                                        <div key={questionIndex} className="border-l-4 border-primary pl-4 py-2">
                                            <h4 className="font-medium text-sm text-muted-foreground">
                                                Question {parseInt(questionIndex) + 1}
                                            </h4>
                                            {Array.isArray(answer) ? (
                                                <div className="mt-1 flex flex-wrap gap-2">
                                                    {answer.map((item, i) => (
                                                        <Badge key={i} variant="secondary">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-foreground">{answer}</p>
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