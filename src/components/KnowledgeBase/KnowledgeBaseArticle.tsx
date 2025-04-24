
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

interface KnowledgeBaseArticleProps {
  article: {
    id: number;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    isAgentOnly: boolean;
  };
}

export const KnowledgeBaseArticle = ({ article }: KnowledgeBaseArticleProps) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/knowledge-base/${article.id}`);
    toast({
      title: "Link copied",
      description: "Article link has been copied to clipboard.",
    });
  };
  
  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    toast({
      title: "Thank you for your feedback",
      description: type === 'helpful' 
        ? "We're glad this article was helpful." 
        : "We'll use your feedback to improve our content.",
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              <Badge variant="outline">{article.category}</Badge>
              <span>•</span>
              <div className="flex items-center">
                <Eye size={14} className="mr-1" />
                {article.viewCount} views
              </div>
              <span>•</span>
              <span>Updated {formatDate(article.updatedAt)}</span>
              {article.isAgentOnly && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Agent Only</Badge>
                </>
              )}
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handleCopyLink}>
            <Copy size={16} />
          </Button>
        </div>
      </div>
      <CardContent className="p-6 prose max-w-none dark:prose-invert">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </CardContent>
      <div className="bg-muted/50 p-6 border-t">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Was this article helpful?</p>
          <div className="flex justify-center space-x-2">
            <Button
              variant={feedback === 'helpful' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeedback('helpful')}
              disabled={feedback !== null}
            >
              <ThumbsUp size={16} className="mr-2" />
              Yes
            </Button>
            <Button
              variant={feedback === 'not-helpful' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFeedback('not-helpful')}
              disabled={feedback !== null}
            >
              <ThumbsDown size={16} className="mr-2" />
              No
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
