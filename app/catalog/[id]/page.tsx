import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Code, Shield, Zap, Clock } from "lucide-react"
import Link from "next/link"

export default async function ApiDetailsPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()

  // Fetch API details
  const { data: api, error } = await supabase
    .from("apis")
    .select("*")
    .eq("id", params.id)
    .eq("status", "active")
    .single()

  if (error || !api) {
    notFound()
  }

  // Fetch API endpoints
  const { data: endpoints } = await supabase
    .from("api_endpoints")
    .select("*")
    .eq("api_id", params.id)
    .order("created_at", { ascending: true })

  const categoryLabels: Record<string, string> = {
    weather: "Погода",
    finance: "Финансы",
    ai: "ИИ",
    social: "Соцсети",
    data: "Данные",
    communication: "Коммуникации",
    other: "Другое",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">API Gateway</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/catalog">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Каталог
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Войти</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* API Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold">{api.name}</h1>
              <Badge variant="secondary">{categoryLabels[api.category] || api.category}</Badge>
            </div>
            <p className="text-xl text-muted-foreground mb-6">{api.description}</p>

            <div className="flex flex-wrap gap-4">
              <Link href={`/subscribe/${api.id}`}>
                <Button size="lg">
                  Подписаться на API
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Code className="mr-2 h-5 w-5" />
                Документация
              </Button>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">${api.price_per_request}</div>
                <p className="text-sm text-muted-foreground">за запрос</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">{api.rate_limit}</div>
                <p className="text-sm text-muted-foreground">запросов в час</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {api.auth_type === "none" ? "Без аутентификации" : `${api.auth_type.toUpperCase()} Auth`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">99.9% Uptime</p>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints */}
          {endpoints && endpoints.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Доступные эндпоинты</CardTitle>
                <CardDescription>Методы и пути для интеграции с API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline">{endpoint.method}</Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {api.base_url}
                          {endpoint.path}
                        </code>
                      </div>
                      {endpoint.description && <p className="text-sm text-muted-foreground">{endpoint.description}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Example */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Пример использования</CardTitle>
              <CardDescription>Быстрый старт с API через наш Gateway</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{`curl -X GET "https://gateway.yourdomain.com/api/${api.id}/proxy${endpoints?.[0]?.path || "/endpoint"}" \\
  -H "Authorization: Bearer YOUR_SUBSCRIPTION_TOKEN" \\
  -H "Content-Type: application/json"`}</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Замените YOUR_SUBSCRIPTION_TOKEN на токен, полученный после подписки на API.
              </p>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Планы подписки</CardTitle>
              <CardDescription>Выберите подходящий план для ваших потребностей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Базовый</h3>
                  <div className="text-2xl font-bold mb-4">
                    $9.99<span className="text-sm font-normal">/мес</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-6">
                    <li>• 1,000 запросов в месяц</li>
                    <li>• Базовая поддержка</li>
                    <li>• Документация API</li>
                  </ul>
                  <Link href={`/subscribe/${api.id}?plan=basic`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Выбрать план
                    </Button>
                  </Link>
                </div>
                <div className="border rounded-lg p-6 border-primary">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Профессиональный</h3>
                    <Badge>Популярный</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-4">
                    $29.99<span className="text-sm font-normal">/мес</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-6">
                    <li>• 10,000 запросов в месяц</li>
                    <li>• Приоритетная поддержка</li>
                    <li>• Аналитика использования</li>
                    <li>• SLA 99.9%</li>
                  </ul>
                  <Link href={`/subscribe/${api.id}?plan=professional`}>
                    <Button className="w-full">Выбрать план</Button>
                  </Link>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Корпоративный</h3>
                  <div className="text-2xl font-bold mb-4">
                    $99.99<span className="text-sm font-normal">/мес</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-6">
                    <li>• 100,000 запросов в месяц</li>
                    <li>• Персональный менеджер</li>
                    <li>• Кастомная интеграция</li>
                    <li>• SLA 99.99%</li>
                  </ul>
                  <Link href={`/subscribe/${api.id}?plan=enterprise`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Выбрать план
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
