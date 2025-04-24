
import { useState, useEffect } from "react";
import { getKbArticles, incrementArticleViews } from "@/lib/db";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Search, Tag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/Auth/AuthContext";
import { KnowledgeBaseArticle } from "./KnowledgeBaseArticle";

export const KnowledgeBase = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  
  useEffect(() => {
    // Get articles based on user role
    const isAgent = user && (user.role === 'agent' || user.role === 'admin');
    const fetchedArticles = getKbArticles(isAgent);
    setArticles(fetchedArticles);
  }, [user]);
  
  const handleViewArticle = (article: any) => {
    incrementArticleViews(article.id);
    setSelectedArticle(article);
  };
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery 
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory
      ? article.category === selectedCategory
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // Group articles by category
  const articlesByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredArticles.filter(article => article.category === category);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title="Knowledge Base" 
        description="Find answers to common questions and learn more about our services"
      />
      
      {selectedArticle ? (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedArticle(null)}
          >
            Back to articles
          </Button>
          <KnowledgeBaseArticle article={selectedArticle} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
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
          </div>
          
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Articles</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recently Updated</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {selectedCategory ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Tag className="mr-2" size={20} />
                    {selectedCategory}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articlesByCategory[selectedCategory]?.map((article) => (
                      <Card 
                        key={article.id} 
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleViewArticle(article)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base mr-2">{article.title}</CardTitle>
                            {article.isAgentOnly && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">Agent Only</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center mt-4 text-xs text-muted-foreground">
                            <Eye size={14} className="mr-1" />
                            {article.viewCount} views
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {articlesByCategory[selectedCategory]?.length === 0 && (
                      <div className="col-span-full text-center py-12 border rounded-md">
                        <Book className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-2 text-muted-foreground">No articles found in this category</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
                  categoryArticles.length > 0 && (
                    <div key={category} className="space-y-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Tag className="mr-2" size={20} />
                        {category}
                      </h2>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryArticles.map((article) => (
                          <Card 
                            key={article.id} 
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleViewArticle(article)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base mr-2">{article.title}</CardTitle>
                                {article.isAgentOnly && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Agent Only</Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {article.content.substring(0, 150)}...
                              </p>
                              <div className="flex items-center mt-4 text-xs text-muted-foreground">
                                <Eye size={14} className="mr-1" />
                                {article.viewCount} views
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                ))
              )}
              
              {filteredArticles.length === 0 && (
                <div className="text-center py-12 border rounded-md">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No articles found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="popular" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .slice(0, 9)
                  .map((article) => (
                    <Card 
                      key={article.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleViewArticle(article)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base mr-2">{article.title}</CardTitle>
                          {article.isAgentOnly && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">Agent Only</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center mt-4 text-xs text-muted-foreground">
                          <Eye size={14} className="mr-1" />
                          {article.viewCount} views
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {filteredArticles.length === 0 && (
                  <div className="col-span-full text-center py-12 border rounded-md">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">No articles found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 9)
                  .map((article) => (
                    <Card 
                      key={article.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleViewArticle(article)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base mr-2">{article.title}</CardTitle>
                          {article.isAgentOnly && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">Agent Only</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center mt-4 text-xs text-muted-foreground">
                          <Eye size={14} className="mr-1" />
                          {article.viewCount} views
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {filteredArticles.length === 0 && (
                  <div className="col-span-full text-center py-12 border rounded-md">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">No articles found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
