"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

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

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {

  const router = useRouter();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function handleLogin(formData: LoginForm) {
  if (loading) return;

  clearErrors();
  setLoginError("");

  setLoading(true);

  try {
    const { data } = await api.post("/token/", formData);

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    login(data.user);

    toast.success("Logged in successfully!");

    router.push(
      data.user.role === "TEACHER"
        ? "/teachers"
        : "/students"
    );
 } catch (error: any) {
  const backendErrors = error.response?.data;

  if (backendErrors) {
    const formFields: (keyof LoginForm)[] = [
      "username",
      "password",
    ];

    Object.entries(backendErrors).forEach(
      ([field, messages]) => {
        const message = Array.isArray(messages)
          ? messages[0]
          : String(messages);

        if (formFields.includes(field as keyof LoginForm)) {
          setError(field as keyof LoginForm, {
            type: "server",
            message,
          });
        } else if (field === "detail" || field === "non_field_errors") {
          setLoginError(message);
        } else {
          toast.error(message);
        }
      }
    );
  } else {
    toast.error("Login failed.");
  }
}
finally {
  setLoading(false);
}
}

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Login to continue your learning journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="username">
                Username
              </Label>

              <Input
                id="username" autoComplete="username" disabled={loading}
                placeholder="Enter your username"
                {...register("username")}
              />

              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  autoComplete="current-password" 
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  {...register("password")} disabled={loading}
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}

              {loginError && (
  <p className="text-sm text-destructive">
    {loginError}
  </p>
)}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}