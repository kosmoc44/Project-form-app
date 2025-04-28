// Dashboard.jsx
"use client"

import CreateForm from './_components/CreateForm'
import { useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import { db } from '../../lib/firebase/config'
import Link from "next/link";
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'

function Dashboard() {
    const formsCollection = collection(db, "forms")
    const { data: forms, status } = useFirestoreCollectionData(formsCollection, {
        idField: "id"
    })

    if (status === 'loading') {
        return (
            <div className="p-4 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="font-bold text-2xl sm:text-3xl">My Forms</h2>
                <CreateForm />
            </div>

            {forms?.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <p className="text-gray-500">No forms created yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {forms?.map(form => (
                        <div key={form.id} className="border p-4 sm:p-6 rounded-lg hover:shadow-md">
                            <h3 className="text-lg sm:text-xl font-semibold mb-2">{form.title}</h3>
                            <p className="text-gray-600 mb-4">{form.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {form.questions.length} questions
                                </span>
                                <Link href={`dashboard/forms/${form.id}`}>
                                    <Button variant="outline" size="sm">
                                        View Form
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard
