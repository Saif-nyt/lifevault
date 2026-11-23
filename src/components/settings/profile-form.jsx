"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { authService } from "@/services/auth.service";
import { initials } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  avatar: z.union([z.string().trim().url("Enter a valid image URL"), z.literal("")]).optional(),
  bio: z.string().max(300).optional(),
});

export function ProfileForm() {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || "", avatar: user?.avatar || "", bio: user?.bio || "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, avatar: user.avatar || "", bio: user.bio || "" });
  }, [user, reset]);

  async function onSubmit(values) {
    try {
      const updated = await authService.updateProfile(values);
      setUser(updated);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const avatar = useWatch({ control, name: "avatar" });
  const name = useWatch({ control, name: "name" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
          <AvatarFallback className="text-base">{initials(name || user?.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name || "Your name"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" {...register("name")} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={user?.email || ""} disabled />
          <p className="text-[11px] text-muted-foreground">Email changes are not available in this version.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-avatar">Avatar URL</Label>
        <Input id="profile-avatar" placeholder="https://…" {...register("avatar")} />
        {errors.avatar ? <p className="text-xs text-destructive">{errors.avatar.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-bio">Short bio</Label>
        <Textarea id="profile-bio" rows={3} placeholder="A line about you and what you keep." {...register("bio")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
        Save profile
      </Button>
    </form>
  );
}
