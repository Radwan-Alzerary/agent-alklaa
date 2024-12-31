// components/SignInForm.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";

export function SignInForm() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/authentication.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          إنشاء حساب
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            نظام إدارة المندوبين
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;هذا النظام ساعدني في إدارة وكلائي وعملائي بكفاءة عالية. إنه يوفر الوقت ويزيد الإنتاجية.&rdquo;
              </p>
              <footer className="text-sm">أحمد محمد</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                تسجيل الدخول إلى حسابك
              </h1>
              <p className="text-sm text-muted-foreground">
                أدخل بريدك الإلكتروني وكلمة المرور أدناه للدخول إلى حسابك
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              بالنقر على الاستمرار، فإنك توافق على{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                شروط الخدمة
              </Link>{" "}
              و{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                سياسة الخصوصية
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
