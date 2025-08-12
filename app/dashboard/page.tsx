import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, BarChart3, Zap, Users, CreditCard } from 'lucide-react'
import Link from "next/link"
import { signOut } from "@/lib/actions"

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's APIs
  const { data: apis, error } = await supabase
    .from("apis")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's subscriptions count
  const { count: subscriptionsCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Fetch total requests count
  const { count: requestsCount } = await supabase
    .from("api_requests")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">API Gateway</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Добро пожаловать, {user.email}</span>
            <form action={signOut}>
              <Button variant="ghost" type="submit">
                Выйти
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Мои API</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apis?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Активных API сервисов</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Подписки</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptionsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Активных подписок</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Запросы</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requestsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Всего обработано</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доход</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">За этот месяц</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Управление API</CardTitle>
              <CardDescription>Создавайте и настраивайте свои API сервисы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/apis/new">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить новый API
                </Button>
              </Link>
              {apis && apis.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  У вас {apis.length} активных API сервисов
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Мои подписки</CardTitle>
              <CardDescription>Управляйте подписками на API сервисы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/subscriptions">
                <Button variant="outline" className="w-full bg-transparent">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Управление подписками
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" className="w-full bg-transparent">
                  Найти новые API
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* APIs Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Мои API</h2>
          <Link href="/dashboard/apis/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить API
            </Button>
          </Link>
        </div>

        {apis && apis.length > 0 ? (
          <div className="grid gap-6">
            {apis.map((api) => (
              <Card key={api.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {api.name}
                        <Badge variant={api.status === "active" ? "default" : "secondary"}>
                          {api.status === "active" ? "Активен" : "Неактивен"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">{api.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/apis/${api.id}`}>
                        <Button variant="outline" size="sm">
                          Настроить
                        </Button>
                      </Link>
                      <Link href={`/dashboard/apis/${api.id}/analytics`}>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">URL:</span>
                      <p className="font-mono text-xs break-all">{api.base_url}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Категория:</span>
                      <p>{api.category || "Не указана"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Цена за запрос:</span>
                      <p>${api.price_per_request}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет API сервисов</h3>
              <p className="text-muted-foreground mb-4">Добавьте свой первый API для начала работы</p>
              <Link href="/dashboard/apis/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить API
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Каталог API</CardTitle>
              <CardDescription>Просмотрите доступные API решения</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/catalog">
                <Button variant="outline" className="w-full bg-transparent">
                  Перейти в каталог
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Документация</CardTitle>
              <CardDescription>Узнайте как интегрировать API</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/docs">
                <Button variant="outline" className="w-full bg-transparent">
                  Читать документацию
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
