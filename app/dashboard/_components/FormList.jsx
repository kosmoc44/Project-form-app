"use client"

import { useState, useEffect } from 'react'
import { db, formsCollection } from '../../../lib/firebaseConfig'
import { getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Library } from 'lucide-react'

function FormList() {
    const [forms, setForms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const querySnapshot = await getDocs(formsCollection)
                const formsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setForms(formsData)
            } catch (error) {
                console.error("Error fetching forms: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchForms()
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Forms</h1>

            {forms.length === 0 ? (
                <div className="text-center py-12">
                    <Library className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No forms yet</h3>
                    <p className="mt-1 text-gray-500">Get started by creating a new form.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {forms.map(form => (
                        <div key={form.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-lg">{form.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{form.description}</p>
                            <p className="text-sm mt-2">{form.questions.length} questions</p>
                            <div className="mt-4 flex justify-end">
                                <Link href={`/dashboard/forms${form.id}`}>
                                    <Button variant="outline">View Form</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FormList