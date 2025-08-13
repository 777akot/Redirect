import { createClient, isSupabaseConfigured, ensureTablesExist } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import CatalogFilters from "@/components/catalog-filters"
import CatalogSearch from "@/components/catalog-search"

interface SearchParams {
  category?: string
  search?: string
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Connect Supabase to get started</h1>
      </div>
    )
  }

  const supabase = createClient()

  // Check if tables exist
  const { data: tableCheck, error: tableError } = await supabase.from("apis").select("id").limit(1)

  // If tables don't exist, show initialization button
  if (tableError && tableError.message.includes("does not exist")) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">API Gateway</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Войти</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Регистрация</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">База данных не инициализирована</h1>
            <p className="text-muted-foreground mb-6">
              Нажмите кнопку ниже, чтобы создать таблицы и добавить тестовые API
            </p>
            <form action="/api/init-db" method="POST">
              <Button type="submit" size="lg" className="w-full">
                Инициализировать базу данных
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  await ensureTablesExist()

  const { data: existingApis, error: countError } = await supabase
    .from("apis")
    .select("id", { count: "exact" })
    .limit(1)

  if (!countError && (!existingApis || existingApis.length === 0)) {
    const sampleApis = [
      {
        name: "OpenWeatherMap",
        description: "Получайте актуальные данные о погоде, прогнозы и исторические данные для любой точки мира",
        category: "weather",
        base_url: "https://api.openweathermap.org/data/2.5",
        pricing_model: "freemium",
        monthly_price: 0,
        requests_limit: 1000,
        auth_type: "api_key",
        documentation_url: "https://openweathermap.org/api",
        is_active: true,
      },
      {
        name: "OpenAI GPT-4",
        description: "Мощная языковая модель для генерации текста, ответов на вопросы и решения сложных задач",
        category: "ai",
        base_url: "https://api.openai.com/v1",
        pricing_model: "pay_per_use",
        monthly_price: 20,
        requests_limit: 10000,
        auth_type: "bearer_token",
        documentation_url: "https://platform.openai.com/docs",
        is_active: true,
      },
      {
        name: "CoinGecko",
        description: "Данные о криптовалютах, ценах, рыночной капитализации и трендах",
        category: "finance",
        base_url: "https://api.coingecko.com/api/v3",
        pricing_model: "freemium",
        monthly_price: 0,
        requests_limit: 500,
        auth_type: "none",
        documentation_url: "https://www.coingecko.com/en/api",
        is_active: true,
      },
      {
        name: "Twilio",
        description: "Отправка SMS, голосовые вызовы и другие коммуникационные сервисы",
        category: "communication",
        base_url: "https://api.twilio.com/2010-04-01",
        pricing_model: "pay_per_use",
        monthly_price: 0,
        requests_limit: 100,
        auth_type: "basic_auth",
        documentation_url: "https://www.twilio.com/docs",
        is_active: true,
      },
      {
        name: "REST Countries",
        description: "Получайте информацию о странах мира: население, столицы, валюты, языки",
        category: "data",
        base_url: "https://restcountries.com/v3.1",
        pricing_model: "free",
        monthly_price: 0,
        requests_limit: 1000,
        auth_type: "none",
        documentation_url: "https://restcountries.com",
        is_active: true,
      },
      {
        name: "Alpha Vantage",
        description: "Финансовые данные: котировки акций, валютные курсы, экономические индикаторы",
        category: "finance",
        base_url: "https://www.alphavantage.co/query",
        pricing_model: "freemium",
        monthly_price: 0,
        requests_limit: 500,
        auth_type: "api_key",
        documentation_url: "https://www.alphavantage.co/documentation",
        is_active: true,
      },
    ]

    await supabase.from("apis").insert(sampleApis)
  }

  let query = supabase.from("apis").select("*").eq("is_active", true)

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category)
  }

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: apis, error } = await query.order("created_at", { ascending: false })

  // Get categories for filter
  const { data: categories } = await supabase
    .from("apis")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null)

  const uniqueCategories = [...new Set(categories?.map((item) => item.category) || [])]

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
            <Link href="/auth/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Каталог API решений</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя мощные API сервисы для интеграции в ваши проекты
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <CatalogSearch />
          </div>
          <div className="md:w-64">
            <CatalogFilters categories={uniqueCategories} categoryLabels={categoryLabels} />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Найдено {apis?.length || 0} API сервисов
            {searchParams.category && searchParams.category !== "all" && (
              <span> в категории "{categoryLabels[searchParams.category] || searchParams.category}"</span>
            )}
            {searchParams.search && <span> по запросу "{searchParams.search}"</span>}
          </p>
        </div>

        {/* API Grid */}
        {apis && apis.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <Card key={api.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{api.name}</CardTitle>
                    <Badge variant="secondary">{categoryLabels[api.category] || api.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-3">{api.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Цена за запрос:</span>
                      <span className="font-semibold">${api.price_per_request}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Лимит в час:</span>
                      <span>{api.rate_limit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Аутентификация:</span>
                      <Badge variant="outline" className="text-xs">
                        {api.auth_type === "none" ? "Не требуется" : api.auth_type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Цена в месяц:</span>
                      <span className="font-semibold">${api.monthly_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Лимит запросов:</span>
                      <span>{api.requests_limit}</span>
                    </div>
                    <div className="pt-2 space-y-2">
                      <Link href={`/catalog/${api.id}`}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Подробнее
                        </Button>
                      </Link>
                      <Link href={`/subscribe/${api.id}`}>
                        <Button className="w-full">
                          Подписаться
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">API не найдены</h3>
            <p className="text-muted-foreground mb-4">Попробуйте изменить параметры поиска или фильтры</p>
            <Link href="/catalog">
              <Button variant="outline">Сбросить фильтры</Button>
            </Link>
          </div>
        )}

        {/* Categories Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Популярные категории</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Link key={key} href={`/catalog?category=${key}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold">{label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {apis?.filter((api) => api.category === key).length || 0} API
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
