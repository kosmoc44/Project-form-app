"use client"

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { ThumbsUp, MessageCircle } from "lucide-react"
import { db } from '../../../lib/firebase/config'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import CommentDrawer from './CommentDrawer'

export const FormInteractions = ({ form }) => {
    const { user } = useUser()
    const [comment, setComment] = useState('')
    const [commentsOpen, setCommentsOpen] = useState(false)

    const handleLike = async () => {
        try {
            const formRef = doc(db, 'forms', form.id)
            const operation = form.likes?.includes(user.id) ? arrayRemove : arrayUnion

            await updateDoc(formRef, {
                likes: operation(user.id)
            })
        } catch (error) {
            toast.error('Error updating likes')
        }
    }

    const addComment = async () => {
        if (!comment.trim()) return

        try {
            const formRef = doc(db, 'forms', form.id)
            const newComment = {
                text: comment.trim(),
                author: user.fullName || 'Anonymous',
                userId: user.id,
                avatar: user.imageUrl,
                createdAt: new Date().toLocaleString()
            }

            await updateDoc(formRef, {
                comments: arrayUnion(newComment)
            })
            setComment('')
        } catch (error) {
            toast.error('Error adding comment')
        }
    }

    const deleteComment = async (commentIndex) => {
        try {
            const formRef = doc(db, 'forms', form.id)
            const commentDelete = form.comments[commentIndex]

            await updateDoc(formRef, {
                comments: arrayRemove(commentDelete)
            })
            toast.success('Comment deleted')
        } catch (error) {
            toast.error('Error deleting commnet')
        }
    }

    return (
        <div className="mt-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-2 px-3"
                >
                    <ThumbsUp />
                    <span className="font-medium">
                        {form.likes?.length || 0}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentsOpen(true)}
                    className="flex items-center gap-2 px-3"
                >
                    <MessageCircle />
                    <span className="font-medium">
                        {form.comments?.length || 0}
                    </span>
                </Button>
            </div>

            <CommentDrawer
                open={commentsOpen}
                onOpenChange={setCommentsOpen}
                comments={form.comments || []}
                comment={comment}
                setComment={setComment}
                onAddComment={addComment}
                onDeleteCommnet={deleteComment}
                currnetUserId={user.id}
            />
        </div>
    )
}

export default FormInteractions