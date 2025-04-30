"use client"

import React, { useState } from 'react'
import { Button } from "../../../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Plus, Trash2, ChevronDown, ChevronUp, PenLine, Type, BookType, BookText, SquareMenu, PlusIcon } from "lucide-react"
import { addDoc, serverTimestamp } from "firebase/firestore"
import { formsCollection } from '../../../lib/firebase/config'
import { toast } from "sonner"

function CreateForm() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [openDialogModal, setOpenDialogModal] = useState(false)
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState({
        text: "",
        type: "text", // "text", "radio", "checkbox"
        options: []
    })
    const [newOption, setNewOption] = useState("")

    const addQuestion = () => {
        if (currentQuestion.text.trim() === "") return

        setQuestions([...questions, currentQuestion])
        setCurrentQuestion({
            text: "",
            type: "text",
            options: []
        })
        setNewOption("")
    }

    const removeQuestion = (index) => {
        const updatedQuestions = [...questions]
        updatedQuestions.splice(index, 1)
        setQuestions(updatedQuestions)
    }

    const addOption = () => {
        if (newOption.trim() === "") return

        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, newOption]
        })
        setNewOption("")
    }

    const removeOption = (index) => {
        const updatedOptions = [...currentQuestion.options]
        updatedOptions.splice(index, 1)
        setCurrentQuestion({
            ...currentQuestion,
            options: updatedOptions
        })
    }

    const moveQuestionUp = (index) => {
        if (index === 0) return
        const updatedQuestions = [...questions]
        const temp = updatedQuestions[index]
        updatedQuestions[index] = updatedQuestions[index - 1]
        updatedQuestions[index - 1] = temp
        setQuestions(updatedQuestions)
    }

    const moveQuestionDown = (index) => {
        if (index === questions.length - 1) return
        const updatedQuestions = [...questions]
        const temp = updatedQuestions[index]
        updatedQuestions[index] = updatedQuestions[index + 1]
        updatedQuestions[index + 1] = temp
        setQuestions(updatedQuestions)
    }

    const handleSubmit = async () => {
        if (title.trim() === "" || questions.length === 0) {
            toast.info("Please add a title and at least one question")
            return
        }

        try {
            await addDoc(formsCollection, {
                title,
                description,
                questions,
                createdAt: serverTimestamp(),
                responses: []
            })

            setTitle("")
            setDescription("")
            setQuestions([])
            setOpenDialogModal(false)
            toast.success('Form created succsessufuly')
        } catch (error) {
            console.error("Error creating form: ", error)
            toast.error("Error creating form")
        }
    }

    return (
        <Dialog open={openDialogModal} onOpenChange={setOpenDialogModal}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    Create Form
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Form</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label><BookType className="w-5 h-5" /> Form Title *</Label>
                        <Input
                            placeholder="Enter form title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label><BookText className="w-5 h-5" /> Form Description</Label>
                        <Textarea
                            placeholder="Describe your form"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Questions</Label>

                        {questions.map((question, index) => (
                            <div key={index} className="border p-4 rounded-lg relative">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{question.text}</p>
                                        {question.type !== "text" && (
                                            <div className="mt-2 space-y-1">
                                                {question.options.map((option, optIndex) => (
                                                    <div key={optIndex} className="flex items-center">
                                                        <input
                                                            type={question.type === "radio" ? "radio" : "checkbox"}
                                                            disabled
                                                            className="mr-2"
                                                        />
                                                        <span>{option}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => moveQuestionUp(index)}
                                            disabled={index === 0}
                                        >
                                            <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => moveQuestionDown(index)}
                                            disabled={index === questions.length - 1}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeQuestion(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="border p-4 rounded-lg space-y-4">
                            <div className="space-y-2">
                                <Label><PenLine className="w-5 h-5" /> Question Text *</Label>
                                <Input
                                    placeholder="Enter question"
                                    value={currentQuestion.text}
                                    onChange={(e) => setCurrentQuestion({
                                        ...currentQuestion,
                                        text: e.target.value
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label><Type className="w-5 h-5" /> Question Type</Label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={currentQuestion.type}
                                    onChange={(e) => setCurrentQuestion({
                                        ...currentQuestion,
                                        type: e.target.value,
                                        options: e.target.value === "text" ? [] : currentQuestion.options
                                    })}
                                >
                                    <option className="dark:text-black" value="text">Text Answer</option>
                                    <option className="dark:text-black" value="radio">Single Choice</option>
                                    <option className="dark:text-black" value="checkbox">Multiple Choice</option>
                                </select>
                            </div>

                            {currentQuestion.type !== "text" && (
                                <div className="space-y-2">
                                    <Label><SquareMenu className="w-5 h-5" /> Options</Label>
                                    {currentQuestion.options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <span>{option}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeOption(index)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}

                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Add option"
                                            value={newOption}
                                            onChange={(e) => setNewOption(e.target.value)}
                                        />
                                        <Button variant={"outline"} onClick={addOption}>
                                            <PlusIcon /> Add
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full mt-4"
                                onClick={addQuestion}
                                variant={"outline"}
                                disabled={currentQuestion.text.trim() === "" ||
                                    (currentQuestion.type !== "text" && currentQuestion.options.length === 0)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Question
                            </Button>
                        </div>
                    </div>

                    <Button
                        variant={"outline"}
                        className="w-full mt-4"
                        onClick={handleSubmit}
                        disabled={title.trim() === "" || questions.length === 0}
                    >
                        Create Form
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateForm

