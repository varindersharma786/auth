"use client";

import { useEffect, useState } from "react";
import { Article, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get("/api/cms/admin/articles");
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/api/cms/articles/${id}`);
      toast.success("Article deleted");
      fetchArticles();
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Articles & Inspiration
          </h1>
          <p className="text-muted-foreground">
            Manage blog posts, stories, and highlights.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/articles/categories">
            <Button variant="outline" className="rounded-full">
              Manage Categories
            </Button>
          </Link>
          <Link href="/admin/articles/new">
            <Button className="rounded-full shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> New Article
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  No articles found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      {article.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* @ts-ignore */}
                    <span className="text-xs font-bold uppercase tracking-wider bg-zinc-100 px-2 py-1 rounded">
                      {/* @ts-ignore */}
                      {article.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {/* @ts-ignore */}
                    {article.isDraft ? (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        Draft
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        Published
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(article.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
