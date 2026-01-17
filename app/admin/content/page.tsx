"use client";

import { useEffect, useState } from "react";
import { api, Banner, Article } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Loader2, Layout, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PageContentManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  const fetchContent = async () => {
    try {
      const [bannersData, articlesData] = await Promise.all([
        api.get("/api/cms/admin/banners"),
        api.get("/api/cms/admin/articles"),
      ]);
      setBanners(bannersData.data);
      setArticles(articlesData.data);
    } catch (error) {
      console.error("Failed to fetch content:", error);
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/api/cms/banners/${id}`);
      toast.success("Banner deleted");
      fetchContent();
    } catch (err) {
      toast.error("Failed to delete banner");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content block?")) return;
    try {
      await api.delete(`/api/cms/articles/${id}`);
      toast.success("Content deleted");
      fetchContent();
    } catch (err) {
      toast.error("Failed to delete content");
    }
  };

  const filteredBanners =
    filterType === "all"
      ? banners
      : banners.filter((b) => b.type === filterType);

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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Layout className="h-8 w-8" />
            Page Content Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all dynamic content across your website pages
          </p>
        </div>
      </div>

      <Tabs defaultValue="banners" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="banners">Hero Banners</TabsTrigger>
          <TabsTrigger value="content">Content Blocks</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="HERO">Hero Banners</SelectItem>
                  <SelectItem value="PROMO">Promo Banners</SelectItem>
                  <SelectItem value="SUB">Sub Banners</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {filteredBanners.length} banner
                {filteredBanners.length !== 1 ? "s" : ""}
              </span>
            </div>
            <Link href="/admin/banners/new">
              <Button className="rounded-full shadow-lg">
                <Plus className="mr-2 h-4 w-4" /> New Banner
              </Button>
            </Link>
          </div>

          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No banners found. Create one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell className="font-medium">
                        {banner.title}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold uppercase tracking-wider bg-zinc-100 px-2 py-1 rounded">
                          {banner.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600">
                        {banner.type === "HERO" && "Home page, Region pages"}
                        {banner.type === "PROMO" && "Promotional sections"}
                        {banner.type === "SUB" && "Secondary banners"}
                      </TableCell>
                      <TableCell>
                        {banner.isActive ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/banners/${banner.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteBanner(banner.id)}
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
        </TabsContent>

        {/* Content Blocks Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Content blocks for intro sections, about pages, and custom content
              areas
            </p>
            <Link href="/admin/articles/new">
              <Button className="rounded-full shadow-lg">
                <Plus className="mr-2 h-4 w-4" /> New Content Block
              </Button>
            </Link>
          </div>

          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
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
                      No content blocks found. Create one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        {article.title}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold uppercase tracking-wider bg-zinc-100 px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-600">
                        {article.category === "HIGHLIGHT" &&
                          "Region intro, Featured sections"}
                        {article.category === "INSPIRATION" &&
                          "Travel stories, Blog posts"}
                        {article.category === "PURPOSE" &&
                          "About us, Mission statement"}
                        {article.category === "NEWS" &&
                          "Updates, Announcements"}
                      </TableCell>
                      <TableCell>
                        {/* @ts-expect-error */}
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Preview">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href={`/admin/articles/${article.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteArticle(article.id)}
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
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Layout className="h-5 w-5 text-blue-600" />
          How to use Page Content Manager
        </h3>
        <div className="space-y-2 text-sm text-zinc-700">
          <p>
            <strong>Hero Banners (HERO):</strong> Main banners for home page and
            region pages. Title appears as headline.
          </p>
          <p>
            <strong>Content Blocks (HIGHLIGHT):</strong> Intro sections for
            regions. Match the title to region name (e.g., "About Africa").
          </p>
          <p>
            <strong>Content Blocks (INSPIRATION):</strong> Travel stories and
            blog posts displayed in carousels.
          </p>
          <p>
            <strong>Content Blocks (PURPOSE):</strong> About us and mission
            statement content.
          </p>
        </div>
      </div>
    </div>
  );
}
