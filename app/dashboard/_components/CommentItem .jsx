import { EllipsisVertical, Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "../../../components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge"


export const CommentItem = ({ comment, onDelete, canDelete }) => (
    <div className="border p-4 rounded-lg bg-background mb-2 group relative">
        {canDelete && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                    >
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={onDelete}
                    >
                        Delete Comment
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )}

        <div className="flex items-start gap-3 pr-6">
            <img
                src={comment.avatar}
                alt={comment.author}
                className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-sm">{comment.author}</p>
                        <Badge>
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Badge>
                    </div>
                </div>
                <p className="mt-2 text-sm text-foreground">{comment.text}</p>
            </div>
        </div>
    </div>
)

export default CommentItem