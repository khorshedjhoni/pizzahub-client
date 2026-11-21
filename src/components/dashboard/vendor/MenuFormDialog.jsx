"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadToImgBB } from "@/lib/imgbb";
import { PIZZA_CATEGORIES } from "@/components/home/PizzaCategories";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getCategoryName(cat) {
  if (!cat) return "";
  return typeof cat === "string" ? cat : cat.name || "";
}

async function getBearerHeader() {
  const res = await fetch("/api/auth/token", { cache: "no-store" });
  if (!res.ok) return {};
  const { token } = await res.json();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function MenuFormDialog({ open, onClose, editItem, onSaved }) {
  const categoryOptions = useMemo(
    () =>
      (PIZZA_CATEGORIES || [])
        .map(getCategoryName)
        .filter(Boolean),
    [],
  );
  const defaultCategory = categoryOptions[0] || "";

  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || "");
      setCategory(getCategoryName(editItem.category) || defaultCategory);
      setDescription(editItem.description || "");
      setPrice(String(editItem.price ?? ""));
      setLocation(editItem.location || "");
      setImageFile(null);
    } else {
      setName("");
      setCategory(defaultCategory);
      setDescription("");
      setPrice("");
      setLocation("");
      setImageFile(null);
    }
  }, [editItem, open, defaultCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editItem && !imageFile) {
      toast.error("Please select a pizza image to upload");
      return;
    }

    try {
      setSubmitting(true);

      let imageUrl = editItem?.image || "";
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      const headers = {
        "Content-Type": "application/json",
        ...(await getBearerHeader()),
      };

      const url = editItem
        ? `${API_URL}/menu/${editItem._id}`
        : `${API_URL}/menu`;
      const method = editItem ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          name: name.trim(),
          category: getCategoryName(category),
          description: description.trim(),
          price: Number(price),
          location: location.trim(),
          image: imageUrl,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to save menu item");
        return;
      }

      toast.success(
        editItem
          ? "Menu item updated!"
          : "Menu item submitted! Waiting for admin approval.",
      );
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pizzaName">Pizza / Item Name</Label>
            <Input
              id="pizzaName"
              placeholder="Pepperoni Feast"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((catName) => (
                    <SelectItem key={catName} value={catName}>
                      {catName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="1"
                placeholder="14.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Delivery Area / City</Label>
            <Input
              id="location"
              placeholder="Downtown / Midtown"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description &amp; Ingredients</Label>
            <Textarea
              id="description"
              placeholder="Hand-tossed dough, San Marzano tomato sauce, mozzarella..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="itemImage">
              Item Photo{" "}
              {editItem ? "(Leave blank to keep current)" : "(Required)"}
            </Label>
            <Input
              id="itemImage"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              required={!editItem}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={submitting}
            >
              {submitting
                ? "Uploading & Saving..."
                : editItem
                  ? "Save Changes"
                  : "Submit Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}