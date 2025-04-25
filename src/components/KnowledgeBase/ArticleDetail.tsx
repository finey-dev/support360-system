
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/Auth/AuthContext";
import { getKbArticle, incrementArticleViews, updateKbArticle, deleteKbArticle } from "@/lib/db";
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Edit, Trash } from "lucide-react";

export const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    category: '',
    isAgentOnly: false
  });

  const fetchArticle = () => {
    if (articleId) {
      const id = parseInt(articleId);
      const articleData = getKbArticle(id);
      
      if (!articleData) {
        navigate('/dashboard/knowledge-base');
        return;
      }

      // Increment view count
      incrementArticleViews(id);
      setArticle(articleData);
      setEditForm({
        title: articleData.title,
        content: articleData.content,
        category: articleData.category,
        isAgentOnly: articleData.isAgentOnly
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [articleId, navigate]);

  const handleEdit = () => {
    if (!articleId) return;
    
    try {
      // Update the article in database
      updateKbArticle(parseInt(articleId), editForm);
      
      // Close dialog first
      setIsEditDialogOpen(false);
      
      // Show toast notification
      toast({
        title: "Article updated",
        description: "The article has been successfully updated."
      });
      
      // Refresh article data
      fetchArticle();
    } catch (error) {
      toast({
        title: "Error updating article",
        description: "There was a problem updating the article.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (!articleId) return;
    
    try {
      // Delete the article from database
      deleteKbArticle(parseInt(articleId));
      
      // Close the dialog first
      setIsDeleteDialogOpen(false);
      
      // Show toast notification
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted."
      });
      
      // Navigate back
      navigate('/dashboard/knowledge-base');
    } catch (error) {
      toast({
        title: "Error deleting article",
        description: "There was a problem deleting the article.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const canEdit = user && (user.role === 'admin' || user.role === 'agent');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base Article"
        description="View and manage knowledge base content"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/knowledge-base')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
            {canEdit && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        }
      />

      <Card>
        {article && <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{article.title}</h1>
              <Badge>{article.category}</Badge>
            </div>
            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </div>
        </CardContent>}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Make changes to the knowledge base article.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Article title"
              />
            </div>
            <div>
              <Input
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div>
              <Textarea
                value={editForm.content}
                onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="Article content (supports Markdown)"
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
