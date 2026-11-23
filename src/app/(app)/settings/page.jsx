"use client";

import { Check, KeyRound, Moon, Palette, Sun, Tags, User, FolderTree } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";
import { CategoryManager, TagManager } from "@/components/settings/taxonomy-managers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Your account, categories, tags and the way LifeVault looks."
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-auto w-full justify-start overflow-x-auto bg-muted p-1 sm:w-auto">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-1.5">
            <FolderTree className="size-3.5" /> Categories
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-1.5">
            <Tags className="size-3.5" /> Tags
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <KeyRound className="size-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="size-3.5" /> Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Your profile</CardTitle>
              <CardDescription>This name and avatar appear in your sidebar and account menu.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Categories</CardTitle>
              <CardDescription>Create, rename, recolor or remove the rooms of your archive.</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Tags</CardTitle>
              <CardDescription>Lightweight labels shared across every archive item.</CardDescription>
            </CardHeader>
            <CardContent>
              <TagManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Change password</CardTitle>
                <CardDescription>Use at least eight characters with a letter and a number.</CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Session</CardTitle>
                <CardDescription>How your login is kept secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 text-foreground">
                  <Check className="size-4 text-primary" /> Stored in a secure, HTTP-only cookie
                </p>
                <p>Authentication tokens are never written to localStorage or exposed to JavaScript.</p>
                <p>Signing out clears the cookie immediately. Sessions expire automatically after seven days.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Theme</CardTitle>
              <CardDescription>Choose how LifeVault looks on this device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid max-w-lg gap-3 sm:grid-cols-2">
                {[
                  { value: "light", label: "Light", description: "Warm paper and forest ink", icon: Sun },
                  { value: "dark", label: "Dark", description: "Deep charcoal and sage", icon: Moon },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition",
                      theme === option.value ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"
                    )}
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                      <option.icon className="size-4" />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {option.label}
                        {theme === option.value ? <Check className="size-3.5 text-primary" /> : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Preference is stored locally in this browser. It is not part of your account data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
