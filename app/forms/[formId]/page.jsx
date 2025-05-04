"use client"

import { useState, useEffect } from 'react'
import { db } from '../../../lib/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

function PublicViewForm() {
    const { formId } = useParams()
    const [form, setForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const docRef = doc(db, "forms", formId)
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
    }, [formId])

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const docRef = doc(db, "forms", formId)
            await updateDoc(docRef, {
                responses: [...(form.responses || []), answers]
            })
            setSubmitted(true)
            toast.success("Form submitted successfully")
        } catch (error) {
            toast.error("Error submitting form")
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )

    if (!form) return (
        <div className="text-center min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Form not found</h1>
        </div>
    )

    if (submitted) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
                <p className="text-gray-600">Your response has been recorded</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="space-y-2 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
                    {form.description && (
                        <p className="text-gray-600">{form.description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {form.questions.map((question, index) => (
                        <div key={index} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {question.text}
                                {question.type !== "text" && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        {question.type === "radio"
                                            ? "(Select one)"
                                            : "(Select all that apply)"}
                                    </span>
                                )}
                            </label>
                            {question.type === "text" ? (
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    required
                                />
                            ) : question.type === "radio" ? (
                                <div className="space-y-2">
                                    {question.options.map((option, optIndex) => (
                                        <label key={optIndex} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name={`question-${index}`}
                                                value={option}
                                                onChange={() => handleAnswerChange(index, option)}
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                                required
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {question.options.map((option, optIndex) => (
                                        <label key={optIndex} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name={`question-${index}`}
                                                value={option}
                                                onChange={(e) => {
                                                    const updated = e.target.checked
                                                        ? [...(answers[index] || []), option]
                                                        : (answers[index] || []).filter(v => v !== option)
                                                    handleAnswerChange(index, updated)
                                                }}
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 px-4 rounded-md 
                                 hover:bg-primary-dark transition-colors font-medium"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PublicViewForm