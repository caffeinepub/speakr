import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Comment } from '@/mock/mockAudio';

interface CommentsPanelProps {
  comments: Comment[];
}

export default function CommentsPanel({ comments }: CommentsPanelProps) {
  if (comments.length === 0) {
    return (
      <div className="pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-4 border-t border-border/50">
      <h4 className="font-semibold text-sm">Comments</h4>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {comments.map((comment, index) => (
          <div key={index}>
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {comment.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground/70">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
              </div>
            </div>
            {index < comments.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
