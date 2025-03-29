import { AuthForm } from "@/components/auth/auth-form"
import { AuthLayout } from "@/layouts/AuthLayout"

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-screen">
        <AuthForm />
      </div>
    </AuthLayout>
  )
}

