"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/imgbb";
import { updateProfile } from "@/lib/action/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "PH"
  );
}

export default function ProfileForm({
  heading = "Profile settings",
  subtitle = "Manage your personal details and profile photo.",
}) {
  const router = useRouter();
  const fileRef = useRef(null);
  const hydrated = useRef(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && !hydrated.current) {
      hydrated.current = true;
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }
  }, [user]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      updateField("image", url);
      toast.success("Photo ready — save to apply it.");
    } catch (error) {
      toast.error(error?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      return toast.error("Your name cannot be empty.");
    }
    setSaving(true);
    const result = await updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      image: form.image,
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error || "Could not update your profile.");
      return;
    }

    toast.success("Profile updated.");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black">{heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="h-fit rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm">
          <div className="relative mx-auto size-28">
            <Avatar className="size-28 rounded-3xl border-4 border-background shadow-lg">
              <AvatarImage src={form.image || ""} alt={form.name || user?.name} />
              <AvatarFallback className="rounded-3xl text-2xl">
                {initials(form.name || user?.name)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-background bg-red-600 text-white shadow-md transition hover:bg-red-700"
              aria-label="Change profile picture"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
          </div>

          <h3 className="mt-4 font-display text-xl font-bold">
            {form.name || user?.name}
          </h3>
          <p className="text-sm text-muted-foreground">{user?.email || ""}</p>

          <div className="mt-3 flex justify-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {user?.role || "customer"}
            </Badge>
          </div>

          <p className="mt-4 text-left text-xs leading-relaxed text-muted-foreground">
            {form.bio || "Add a short bio or delivery note about yourself."}
          </p>

          <div className="mt-5 space-y-2 rounded-xl bg-muted/60 p-4 text-left text-xs text-muted-foreground">
            <p>
              <span className="font-bold text-foreground">Member since: </span>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "Recently"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
        >
          <h3 className="font-display text-lg font-bold">Personal information</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Update your name, contact number, and bio.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name" className="flex items-center gap-1.5">
                <UserRound className="size-3.5 text-muted-foreground" />
                Full name
              </Label>
              <Input
                id="full-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email" className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Email
              </Label>
              <Input id="user-email" value={user?.email || ""} disabled />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="user-phone" className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="user-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="user-bio">Bio</Label>
              <Textarea
                id="user-bio"
                placeholder="Favorite pizza style, delivery preferences..."
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="min-h-24"
                maxLength={500}
              />
              <p className="text-right text-[11px] text-muted-foreground">
                {form.bio.length}/500
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 size-4" />
              )}
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}