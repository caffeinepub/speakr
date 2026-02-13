import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { MockComment } from '@/mock/mockAudio';

interface CommentsPanelProps {
  comments: MockComment[];
}

export default function CommentsPanel({ comments }: CommentsPanelProps) {
  return (
    <div className="space-y-3 pt-3 border-t">
      <h4 className="font-semibold text-sm">Comments</h4>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs">
                {comment.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-foreground/90">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
