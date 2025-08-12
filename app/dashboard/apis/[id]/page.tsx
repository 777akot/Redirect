import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react"
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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch API details
  const { data: api, error } = await supabase
    .from("apis")
    .select("*")
    .eq("id", params.id)
    .eq("owner_id", user.id)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {api.name}
                  <Badge variant={api.status === "active" ? "default" : "secondary"}>
                    {api.status === "active" ? "Активен" : "Неактивен"}
                  </Badge>
                </h1>
                <p className="text-muted-foreground mt-1">{api.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Конфигурация API</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Базовый URL</h4>
                    <p className="font-mono text-sm bg-muted p-2 rounded break-all">{api.base_url}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Категория</h4>
                    <p>{api.category || "Не указана"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Тип аутентификации</h4>
                    <p className="capitalize">{api.auth_type}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Лимит запросов</h4>
                    <p>{api.rate_limit} в час</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Цена за запрос</h4>
                    <p>${api.price_per_request}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Статус</h4>
                    <Badge variant={api.status === "active" ? "default" : "secondary"}>
                      {api.status === "active" ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endpoints */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Эндпоинты</CardTitle>
                    <CardDescription>Доступные методы и пути API</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить эндпоинт
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {endpoints && endpoints.length > 0 ? (
                  <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                      <div key={endpoint.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{endpoint.method}</Badge>
                            <code className="text-sm">{endpoint.path}</code>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {endpoint.description && (
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Эндпоинты не настроены</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить первый эндпоинт
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Статистика использования</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Запросов сегодня</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Активных подписок</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-sm text-muted-foreground">Доход за месяц</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
