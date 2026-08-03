"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/lib/axios";
import { toast } from "sonner";

import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),

    email: z.string().email("Enter a valid email"),

    role: z.enum(["STUDENT", "TEACHER"]),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


type RegisterForm = z.infer<typeof registerSchema>;


export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  

  const {
  register,
  handleSubmit,
  setValue,
  setError,
  watch,
  formState: { errors, isValid },
} = useForm<RegisterForm>({
  resolver: zodResolver(registerSchema),
  mode: "onChange",
  defaultValues: {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  },
});

const password = watch("password");
  const passwordChecks = {
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  lowercase: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[^A-Za-z0-9]/.test(password),
};

const strength =
  Object.values(passwordChecks).filter(Boolean).length;

const strengthText = [
  "Very Weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
  "Excellent",
][strength];

const strengthColor = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-600",
][strength];



  async function handleRegister(formData: RegisterForm) {
    if (loading) return;
    setLoading(true);

    try {
      await api.post("/register/", {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast.success("Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
  const backendErrors = error.response?.data;

  const formFields: (keyof RegisterForm)[] = [
    "first_name",
    "last_name",
    "username",
    "email",
    "password",
    "confirmPassword",
    "role",
  ];

  if (backendErrors) {
    Object.entries(backendErrors).forEach(([field, messages]) => {
      if (formFields.includes(field as keyof RegisterForm)) {
        setError(field as keyof RegisterForm, {
          type: "server",
          message: Array.isArray(messages)
            ? messages[0]
            : String(messages),
        });
      } else {
        toast.error(
          Array.isArray(messages)
            ? messages[0]
            : String(messages)
        );
      }
    });
  } else {
    toast.error("Registration failed.");
  }
} finally {
  setLoading(false);
}
}

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">
            Create Account
          </CardTitle>

          <CardDescription>
            Join our LMS and start learning today.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
  onSubmit={handleSubmit(handleRegister)}
  className="space-y-4"
>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="first_name">First Name</Label>
      <Input
        id="first_name"
        {...register("first_name")}
      />
      {errors.first_name && (
        <p className="mt-1 text-sm text-destructive">
          {errors.first_name.message}
        </p>
      )}
    </div>

    <div>
      <Label htmlFor="last_name">Last Name</Label>
      <Input
        id="last_name"
        {...register("last_name")}
      />
      {errors.last_name && (
        <p className="mt-1 text-sm text-destructive">
          {errors.last_name.message}
        </p>
      )}
    </div>
  </div>

  <div>
    <Label htmlFor="username">Username</Label>
    <Input
      id="username"
      {...register("username")}
    />
    {errors.username && (
      <p className="mt-1 text-sm text-destructive">
        {errors.username.message}
      </p>
    )}
  </div>

  <div>
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      {...register("email")}
    />
    {errors.email && (
      <p className="mt-1 text-sm text-destructive">
        {errors.email.message}
      </p>
    )}
  </div>

  <div className="space-y-2">
  <Label htmlFor="role">Role</Label>

  <Select
    defaultValue="STUDENT"
    onValueChange={(value) =>
      setValue("role", value as "STUDENT" | "TEACHER",{
        shouldValidate: true,
        shouldDirty: true,
      }
    )
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select your role" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="STUDENT">
        Student
      </SelectItem>

      <SelectItem value="TEACHER">
        Teacher
      </SelectItem>
    </SelectContent>
  </Select>

  {errors.role && (
    <p className="text-sm text-destructive">
      {errors.role.message}
    </p>
  )}
</div>

  <div>
    <Label htmlFor="password">Password</Label>

    <div className="relative">
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        {...register("password")}
      />

      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>

    {errors.password && (
      <p className="mt-1 text-sm text-destructive">
        {errors.password.message}
      </p>
    )}
  </div>

  <div>
    <Label htmlFor="confirmPassword">
      Confirm Password
    </Label>

    <div className="relative">
      <Input
        id="confirmPassword"
        type={showConfirm ? "text" : "password"}
        {...register("confirmPassword")}
      />

      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={() => setShowConfirm(!showConfirm)}
      >
        {showConfirm ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>

    {errors.confirmPassword && (
      <p className="mt-1 text-sm text-destructive">
        {errors.confirmPassword.message}
      </p>
    )}
  </div>

  <div className="mt-2 space-y-1 text-sm">
  <p
    className={
      passwordChecks.length
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {passwordChecks.length ? "✓" : "✗"} At least 8 characters
  </p>

  <p
    className={
      passwordChecks.uppercase
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {passwordChecks.uppercase ? "✓" : "✗"} One uppercase letter
  </p>

  <p
    className={
      passwordChecks.lowercase
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {passwordChecks.lowercase ? "✓" : "✗"} One lowercase letter
  </p>

  <p
    className={
      passwordChecks.number
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {passwordChecks.number ? "✓" : "✗"} One number
  </p>

  <p
    className={
      passwordChecks.special
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {passwordChecks.special ? "✓" : "✗"} One special character
  </p>
</div>

<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Password Strength</span>
    <span
      className={
        strength >= 4
          ? "text-green-600 font-medium"
          : strength >= 2
          ? "text-yellow-600 font-medium"
          : "text-red-500 font-medium"
      }
    >
      {strengthText}
    </span>
  </div>

  <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
    <div
      className={`h-full transition-all duration-300 ${strengthColor}`}
      style={{
        width: `${(strength / 5) * 100}%`,
      }}
    />
  </div>
</div>


  <Button
    type="submit"
    className="w-full"
    disabled={loading || !isValid}
  >
    {loading ? "Creating Account..." : "Create Account"}
  </Button>

  <p className="text-center text-sm text-muted-foreground">
    Already have an account?{" "}
    <Link
      href="/login"
      className="font-medium text-primary hover:underline"
    >
      Login
    </Link>
  </p>
</form>
        </CardContent>
      </Card>
    </div>
  );
}