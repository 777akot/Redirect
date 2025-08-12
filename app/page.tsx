import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">API Gateway</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Управляйте API запросами
            <br />
            <span className="text-primary">легко и эффективно</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Централизованный сервис для перенаправления API запросов с мониторингом, аналитикой и системой подписок
          </p>
          <div className="space-x-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8">
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Каталог API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Возможности платформы</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Быстрое перенаправление</h3>
              <p className="text-muted-foreground">
                Мгновенная маршрутизация запросов к нужным API с минимальной задержкой
              </p>
            </div>
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
              <p className="text-muted-foreground">Защищенные соединения, аутентификация и контроль доступа</p>
            </div>
            <div className="text-center p-6">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
              <p className="text-muted-foreground">
                Подробная статистика использования и мониторинг производительности
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 API Gateway. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
