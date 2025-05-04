"use client"

import { useFirestoreCollectionData } from "reactfire"
import { collection } from "firebase/firestore"
import { db } from '../../../lib/firebase/config'
import { Button } from '../../../components/ui/button'
import { Skeleton } from '../../../components/ui/skeleton'
import { Link, Copy, BarChart } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "../../../components/ui/card"
import { toast } from "sonner"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { useSearch } from "../../hooks/useSearch"
import { SearchBar } from "../_components/SearchBar"

function LinkPage() {
  const formsCollection = collection(db, "forms")
  const { data: forms, status } = useFirestoreCollectionData(formsCollection, {
    idField: "id"
  })
  const { search, setSearch, filteredItems: filteredForms } = useSearch(forms || [])

  const copyToClipboard = (formId) => {
    const publicLink = `${window.location.origin}/forms/${formId}`
    navigator.clipboard.writeText(publicLink)
    toast.success("Public link copied to clipboard")
  }

  if (status === 'loading') {
    return (
      <div className="p-4 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-65 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-2xl sm:text-3xl mb-2">Form Links</h2>
          <p className="text-muted-foreground">Manage and track your form links</p>
        </div>
        <div>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Links..."
          />
        </div>
      </div>

      {filteredForms?.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500">
            {search ? "No matching forms found" : "No links created yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms?.map(form => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-primary" />
                  {form.title}
                </CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={`${window.location.origin}/forms/${form.id}`}
                    readOnly
                    className="truncate"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(form.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Responses</p>
                    <Badge variant="secondary">
                      {form.responses?.length || 0} responses
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <BarChart className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Created: {form.createdAt?.toDate().toLocaleDateString()}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default LinkPage
