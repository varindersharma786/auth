"use client";

import { useEffect, useState } from "react";
import { Article, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Save,
  X,
  Image as ImageIcon,
  Calendar,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "../editor/rich-text-editor";
import { ArticleCategory } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ArticleFormProps {
  id?: string;
}

export default function ArticleForm({ id }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [formData, setFormData] = useState<
    Partial<
      Article & {
        categoryId: string;
        metaTitle: string;
        metaDescription: string;
      }
    >
  >({
    title: "",
    slug: "",
    categoryId: "",
    content: "",
    isDraft: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  } as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, articleRes] = await Promise.all([
          api.get("/api/cms/categories"),
          id
            ? api.get(`/api/cms/admin/articles/${id}`)
            : Promise.resolve({ data: null }),
        ]);

        setCategories(categoriesRes.data);

        if (articleRes.data) {
          setFormData(articleRes.data);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await api.put(`/api/cms/articles/${id}`, formData);
        toast.success("Article updated");
      } else {
        await api.post("/api/cms/articles", formData);
        toast.success("Article created");
      }
      router.push("/admin/articles");
    } catch (error) {
      toast.error("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <X className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {id ? "Edit Article" : "Create New Article"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            onClick={() => router.back()}
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-black text-white hover:bg-zinc-800"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-zinc-200">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Title</Label>
                <Input
                  required
                  className="text-lg py-6"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: id ? formData.slug : generateSlug(title),
                    });
                  }}
                  placeholder="e.g. The Ultimate Guide to Safari in Kenya"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Content</Label>
                <RichTextEditor
                  content={formData.content || ""}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Excerpt / Subtitle */}
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-base font-semibold">Excerpt</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-zinc-500 text-sm mb-2">
                Add a summary of the post to appear on your home page or blog.
              </p>
              <Input
                value={formData.subtitle || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Short description..."
              />
            </CardContent>
          </Card>

          {/* SEO Preview */}
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Search engine listing preview
              </CardTitle>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Edit website SEO
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1 max-w-[600px]">
                <p className="text-xs text-zinc-500">
                  Add a title and description to see how this article might
                  appear in a search engine listing
                </p>
                {/* Google Preview */}
                <div className="pt-2">
                  <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                    {formData.metaTitle || formData.title || "Page Title"}
                  </div>
                  <div className="text-sm text-[#006621] truncate">
                    {`${typeof window !== "undefined" ? window.location.origin : "https://example.com"}/blog/${formData.slug || "slug"}`}
                  </div>
                  <div className="text-sm text-[#545454] line-clamp-2">
                    {formData.metaDescription ||
                      formData.subtitle ||
                      formData.content
                        ?.replace(/<[^>]*>?/gm, "")
                        .substring(0, 160) ||
                      "Page description..."}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Page title</Label>
                  <Input
                    value={formData.metaTitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, metaTitle: e.target.value })
                    }
                    placeholder={formData.title}
                    maxLength={70}
                  />
                  <p className="text-xs text-zinc-500 text-right">
                    0 of 70 characters used
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.metaDescription || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder={formData.subtitle}
                    maxLength={320}
                  />
                  <p className="text-xs text-zinc-500 text-right">
                    0 of 320 characters used
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>URL handle</Label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-zinc-300 bg-zinc-50 text-gray-500 text-sm">
                      /blog/
                    </span>
                    <Input
                      className="rounded-l-none"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Visibility Card */}
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-base font-semibold">
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Visible</Label>
                  <p className="text-xs text-zinc-500">
                    Check to publish this article
                  </p>
                </div>
                <Switch
                  checked={!formData.isDraft}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDraft: !checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Featured</Label>
                  <p className="text-xs text-zinc-500">Show on home page</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isFeatured: checked })
                  }
                />
              </div>

              <div className="pt-2">
                <Label className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2 block">
                  Publish Date
                </Label>
                <div className="flex items-center text-sm text-zinc-600 gap-2">
                  <Calendar className="h-4 w-4" />
                  {formData.publishedAt
                    ? new Date(formData.publishedAt).toLocaleDateString()
                    : "Set to publish on save"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image Card */}
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-base font-semibold">
                Featured image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-zinc-50 transition-colors cursor-pointer relative bg-zinc-50">
                {formData.image ? (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden group">
                    <img
                      src={formData.image}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setFormData({ ...formData, image: "" })}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <ImageIcon className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-blue-600">
                        Add image
                      </span>{" "}
                      or drop URL
                    </div>
                  </>
                )}
                <input
                  type="text"
                  className="absolute inset-x-0 bottom-0 opacity-0 h-10 w-full cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  // Hacky URL input overlay for pure text input, ideally a modal or file uploader
                />
              </div>
              {/* Explicit URL input fallback */}
              <div className="mt-4">
                <Label className="text-xs mb-1 block">Image URL</Label>
                <Input
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card className="shadow-sm border-zinc-200">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-base font-semibold">
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId || formData.category?.id}
                  onValueChange={(val) =>
                    setFormData({ ...formData, categoryId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={formData.author || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Author name"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
