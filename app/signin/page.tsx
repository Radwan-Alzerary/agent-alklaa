import { Metadata } from "next"
import { SignInForm } from "@/components/signin-form"

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "تسجيل الدخول إلى حسابك",
}

export default function SignInPage() {
  return <SignInForm />
}

