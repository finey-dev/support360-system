
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getInitials, getRelativeTime } from "@/lib/utils";
import { createComment, getTicketComments } from "@/lib/db";
import { useAuth } from "@/components/Auth/AuthContext";

interface Comment {
  id: number;
  userId: number;
  ticketId: number;
  content: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

interface TicketCommentProps {
  ticketId: number;
  initialComments?: Comment[];
}

export const TicketComment = ({ ticketId, initialComments = [] }: TicketCommentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePostComment = () => {
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      const createdComment = createComment({
        content: newComment,
        ticketId: ticketId,
        userId: user.id
      });

      // Add user data to new comment for display
      const commentWithUser = {
        ...createdComment,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl
        }
      };

      setComments([...comments, commentWithUser]);
      setNewComment("");
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added to the ticket.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Comments</h3>
      
      {/* Comment list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatarUrl} alt={comment.user?.name} />
                    <AvatarFallback>{getInitials(comment.user?.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{comment.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getRelativeTime(comment.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to comment on this ticket</p>
          </div>
        )}
      </div>
      
      {/* Add comment form */}
      <div className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button 
            onClick={handlePostComment} 
            disabled={!newComment.trim() || submitting}
          >
            <Send size={16} className="mr-2" />
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
