import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "../../../components/ui/drawer"
import { Button } from '../../../components/ui/button'
import { Textarea } from "../../../components/ui/textarea"
import CommentItem from "./CommentItem "
import { X } from "lucide-react"



export const CommentDrawer = ({
    open,
    onOpenChange,
    comments,
    comment,
    setComment,
    onAddComment,
    onDeleteCommnet,
    currnetUserId
}) => (
    <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] max-h-screen">
            <div className="p-4">
                <DrawerHeader className="text-left">
                    <div className="flex items-center justify-between">
                        <DrawerTitle>Comments ({comments.length})</DrawerTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 mt-4">
                        {comments.map((comment, index) => (
                            <CommentItem
                                key={index}
                                comment={comment}
                                onDelete={() => onDeleteCommnet(index)}
                                canDelete={comment.userId === currnetUserId}
                            />
                        ))}
                    </div>

                    <div className="pt-4 border-t mt-4">
                        <div className="flex gap-2">
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 min-h-[100px]"
                            />
                            <Button
                                variant={"outline"}
                                onClick={onAddComment}
                                disabled={!comment.trim()}
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DrawerContent>
    </Drawer>
)

export default CommentDrawer