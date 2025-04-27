"use client"

import CreateForm from './_components/CreateForm'
import { useFirestoreCollectionData } from "reactfire";
import { collection } from "firebase/firestore";
import { db } from '../../lib/firebase/config'
import Link from "next/link";
import {Button} from '../../components/ui/button'

function Dashboard() {
    const formsCollection = collection(db, "forms")
    const { data: forms } = useFirestoreCollectionData(formsCollection, {
        idField: "id"
    })

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-3xl">My Forms</h2>
                <CreateForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms?.map(form => (
                    <div key={form.id} className="border p-6 rounded-lg hover:shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{form.title}</h3>
                        <p className="text-gray-600 mb-4">{form.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {form.questions.length} questions
                            </span>
                            <Link href={`dashboard/forms/${form.id}`}>
                                <Button variant="outline">View Form</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
