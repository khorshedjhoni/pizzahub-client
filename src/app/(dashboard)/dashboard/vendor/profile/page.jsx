"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Crown,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Store,
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

export default function VendorProfilePage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const hydrated = useRef(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    location: "",
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
        businessName: user.businessName || "",
        location: user.location || "",
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
      toast.success("Logo ready — save to apply it.");
    } catch (error) {
      toast.error(error?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return toast.error("Your name cannot be empty.");
    if (!form.businessName.trim()) {
      return toast.error("Add your restaurant name.");
    }

    setSaving(true);
    const result = await updateProfile({
      name: form.name.trim(),
      businessName: form.businessName.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      bio: form.bio.trim(),
      image: form.image,
    });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error || "Could not update your profile.");
      return;
    }

    toast.success("Vendor profile updated.");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-[30rem] rounded-2xl" />
      </div>
    );
  }

  const isPremium = user?.subscriptionPlan === "premium";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-black">Vendor profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is how customers see your kitchen across PizzaHub.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="h-fit rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm">
          <div className="relative mx-auto size-28">
            <Avatar className="size-28 rounded-3xl border-4 border-background shadow-lg">
              <AvatarImage src={form.image || ""} alt={form.businessName} />
              <AvatarFallback className="rounded-3xl text-2xl">
                {initials(form.businessName || form.name || user?.name)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
              aria-label="Change restaurant logo"
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
            {form.businessName || user?.businessName || form.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {form.location || "Add your location"}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {user?.role || "vendor"}
            </Badge>
            <Badge
              variant={isPremium ? "default" : "outline"}
              className={isPremium ? "bg-amber-500 text-black hover:bg-amber-500 gap-1" : ""}
            >
              {isPremium ? (
                <>
                  <Crown className="size-3" /> Premium
                </>
              ) : (
                "Free plan"
              )}
            </Badge>
          </div>

          <p className="mt-4 line-clamp-3 text-left text-xs leading-relaxed text-muted-foreground">
            {form.bio ||
              "Tell customers about your kitchen — your story, your specialities and what makes your dough different."}
          </p>

          <div className="mt-5 space-y-2 rounded-xl bg-muted/60 p-4 text-left text-xs text-muted-foreground">
            <p>
              <span className="font-bold text-foreground">Owner: </span>
              {form.name || user?.name}
            </p>
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
          <h3 className="font-display text-lg font-bold">Kitchen details</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Keep your storefront accurate so customers know what to expect.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="owner" className="flex items-center gap-1.5">
                <UserRound className="size-3.5 text-muted-foreground" />
                Owner name
              </Label>
              <Input
                id="owner"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant" className="flex items-center gap-1.5">
                <Store className="size-3.5 text-muted-foreground" />
                Restaurant name
              </Label>
              <Input
                id="restaurant"
                value={form.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-email" className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Email
              </Label>
              <Input id="vendor-email" value={user?.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor-phone" className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="vendor-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location" className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Location / neighbourhood
              </Label>
              <Input
                id="location"
                placeholder="Downtown, Riverside…"
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">About your kitchen</Label>
              <Textarea
                id="bio"
                placeholder="Family recipes, 48-hour dough, wood-fired since 1998…"
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="min-h-28"
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