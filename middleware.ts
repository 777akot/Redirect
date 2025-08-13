import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(request: NextRequest) {
  const supabase = createClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/")
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

    // Если пользователь не аутентифицирован и пытается попасть на защищенную страницу
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Если пользователь аутентифицирован и находится на странице входа
    if (session && isAuthRoute) {
      const redirectUrl = new URL("/dashboard", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    // В случае ошибки с проверкой сессии, разрешаем доступ
    console.error("Middleware auth error:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
