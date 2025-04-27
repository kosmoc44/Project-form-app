"use client"

import { useState, useEffect } from 'react'
import { db } from '../../../../lib/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '../../../../components/ui/button'
import { toast } from "sonner"
import { ArrowLeft, CheckCircle } from "lucide-react"

function ViewForm() {
    const { id } = useParams()
    const router = useRouter()
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const docRef = doc(db, "forms", id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setForm(docSnap.data())

                    const initialAnswers = {}
                    docSnap.data().questions.forEach((_, index) => {
                        initialAnswers[index] = ""
                    })
                    setAnswers(initialAnswers)
                } else {
                    console.log("No such document!")
                }
            } catch (error) {
                console.error("Error fetching form: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchForm()
    }, [id])

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const docRef = doc(db, "forms", id)
            await updateDoc(docRef, {
                responses: [...(form.responses || []), answers]
            })
            setSubmitted(true)
            toast.success("Form submited succsessufuly")
        } catch (error) {
            console.error("Error submitting form: ", error)
            toast.error("Error submitting form")
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )
    if (!form) return <div>Form not found</div>
    if (submitted) return (
        <div className="flex flex-col items-center justify-center mt-10">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Thank you for your response!</h1>
            <p className="text-gray-600 mb-6">Your answers have been successfully recorded.</p>
            <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to forms
            </Button>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        className="px-3 py-2 text-sm font-medium"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to forms
                    </Button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{form.title}</h1>
                {form.description && <p className="text-gray-600 dark:text-gray-300 mb-6">{form.description}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {form.questions.map((question, index) => (
                        <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                {question.text} {question.type !== "text" && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        {question.type === "radio" ? "(Select one)" : "(Select all that apply)"}
                                    </span>
                                )}
                            </label>

                            {question.type === "text" ? (
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={answers[index] || ""}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    required
                                />
                            ) : question.type === "radio" ? (
                                <div className="space-y-2">
                                    {question.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={option}
                                                checked={answers[index] === option}
                                                onChange={() => handleAnswerChange(index, option)}
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 mr-2"
                                                required
                                            />
                                            <span>{option}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : question.type === "checkbox" ? (
                                <div className="space-y-2">
                                    {question.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={`question-${index}`}
                                                value={option}
                                                checked={answers[index]?.includes?.(option) || false}
                                                onChange={(e) => {
                                                    const currentAnswers = answers[index] || []
                                                    let updatedAnswers

                                                    if (e.target.checked) {
                                                        updatedAnswers = [...currentAnswers, option]
                                                    } else {
                                                        updatedAnswers = currentAnswers.filter(ans => ans !== option)
                                                    }

                                                    handleAnswerChange(index, updatedAnswers)
                                                }}
                                                className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                                            />
                                            <span>{option}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ))}

                    <Button variant={"outline"} type="submit" className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md shadow-sm transition-colors">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ViewForm