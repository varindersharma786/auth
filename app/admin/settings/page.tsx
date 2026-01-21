"use client";

import { useEffect, useState } from "react";
import { SiteSettings, api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SiteSettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Africa Tours",
    socialLinks: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/api/cms/settings");
        if (data) setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/cms/settings", settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
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
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Global Site Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your website's identity, contact info, and SEO.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
            <CardDescription>
              Primary identification for the website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={settings.logoUrl || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, logoUrl: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How customers can reach you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={settings.contactEmail || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input
                  value={settings.contactPhone || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, contactPhone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Physical Address</Label>
              <Textarea
                value={settings.address || ""}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Connect your social media profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Label>
                <Input
                  placeholder="https://facebook.com/yourpage"
                  value={(settings.socialLinks as any)?.facebook || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks as any),
                        facebook: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter / X
                </Label>
                <Input
                  placeholder="https://twitter.com/yourhandle"
                  value={(settings.socialLinks as any)?.twitter || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks as any),
                        twitter: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  placeholder="https://instagram.com/yourprofile"
                  value={(settings.socialLinks as any)?.instagram || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks as any),
                        instagram: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={(settings.socialLinks as any)?.linkedin || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...(settings.socialLinks as any),
                        linkedin: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer Content</CardTitle>
            <CardDescription>
              Information shown at the bottom of every page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Footer Text / Bio</Label>
              <Textarea
                value={settings.footerText || ""}
                onChange={(e) =>
                  setSettings({ ...settings, footerText: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="rounded-full px-8" disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
