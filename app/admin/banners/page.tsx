"use client";

import { useEffect, useState } from "react";
import { Banner, api } from "@/lib/api";
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
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  MoveVertical,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/api/cms/admin/banners");
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/api/cms/banners/${id}`);
      toast.success("Banner deleted");
      fetchBanners();
    } catch (error) {
      toast.error("Failed to delete banner");
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
            Banners & Promotions
          </h1>
          <p className="text-muted-foreground">
            Manage Hero slides, promo banners, and sub-banner content.
          </p>
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
              <TableHead className="w-12"></TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  No banners found. Add your first one!
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <MoveVertical className="h-4 w-4 text-zinc-300 cursor-move" />
                  </TableCell>
                  <TableCell>
                    <div className="relative h-12 w-20 rounded-md overflow-hidden bg-zinc-100 border">
                      {banner.imageUrl ? (
                        <Image
                          src={banner.imageUrl}
                          alt="Banner"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-4 w-4 text-zinc-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">
                      {banner.type}
                    </span>
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
                        onClick={() => handleDelete(banner.id)}
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
