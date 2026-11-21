"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { uploadToImgBB } from "@/lib/imgbb";
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
import PasswordInput from "./PasswordInput";
import GoogleButton from "./GoogleButton";
import { toast } from "sonner";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pwdError = validatePassword(password);
    if (pwdError) {
      toast.error(pwdError);
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      toast.error("Please enter your restaurant / pizzeria name");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: imageUrl || undefined,
        role,
        businessName: role === "vendor" ? businessName.trim() : "",
        location: location.trim(),
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push(role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer");
      router.refresh();
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Min 6 characters, with at least 1 uppercase and 1 lowercase letter.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Account Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select account role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "vendor" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Restaurant Name</Label>
              <Input
                id="businessName"
                placeholder="Luigi's Woodfire Pizza"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City / Area</Label>
              <Input
                id="location"
                placeholder="Downtown / Brooklyn"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Image (Optional)</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <GoogleButton label="Sign up with Google" />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-red-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}