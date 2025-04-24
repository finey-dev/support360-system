import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/Auth/AuthContext";
import { getKbArticles } from "@/lib/db";
import { Link } from "react-router-dom";
import { Search, BookOpen, TrendingUp } from "lucide-react";

interface KbArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isAgentOnly: boolean;
}

export const KnowledgeBase = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const isAgent = user?.role === 'agent' || user?.role === 'admin';
    const fetchedArticles = getKbArticles(isAgent);
    setArticles(fetchedArticles);
    setLoading(false);
  }, [user]);
  
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const popularArticles = [...articles]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);
  
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-12 bg-muted rounded"></div>
        <div className="animate-pulse h-64 bg-muted rounded"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Find answers to common questions and learn how to use our platform.
          </p>
        </div>
        
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Articles</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article}
                onClick={() => navigate(`/dashboard/knowledge-base/${article.id}`)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="popular" className="space-y-4">
          {popularArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          {recentArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ArticleCardProps {
  article: KbArticle;
  onClick: () => void;
}

const ArticleCard = ({ article, onClick }: ArticleCardProps) => {
  return (
    <Card className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-medium">
            <Link 
              to={`/dashboard/knowledge-base/${article.id}`}
              className="hover:underline"
            >
              {article.title}
            </Link>
          </CardTitle>
          <Badge variant="outline">{article.category}</Badge>
        </div>
        <CardDescription className="flex items-center space-x-4 text-xs">
          <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
          <span className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1" />
            {article.viewCount} views
          </span>
          {article.isAgentOnly && (
            <Badge variant="secondary" className="text-xs">Staff Only</Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">
          {article.content.replace(/#|\*|`|_|-|\[|\]/g, '').substring(0, 200)}...
        </p>
      </CardContent>
    </Card>
  );
};
