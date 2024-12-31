// components/user-auth-form.tsx

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { login } = useAuth();

  // State to handle role selection
  const [role, setRole] = React.useState<'user' | 'agent'>('user');

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
      role: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    const success = await login(email, password, role);

    setIsLoading(false);
    if (success) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك في نظام إدارة المندوبين",
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {/* Role Selection */}
          <div className="grid gap-1">
            <Label htmlFor="role" className="sr-only">
              الدور
            </Label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'agent')}
              className="input-class" // Replace with your input classes
              disabled={isLoading}
              required
            >
              <option value="user">مسؤول النظام</option>
              <option value="agent">مندوب مبيعات</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Input */}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              كلمة المرور
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="كلمة المرور"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            تسجيل الدخول
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            أو استمر باستخدام
          </span>
        </div>
      </div>

      {/* GitHub Login (Optional) */}
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        GitHub
      </Button>
    </div>
  );
}
