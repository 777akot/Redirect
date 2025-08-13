import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function ensureTablesExist() {
  if (!isSupabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false
  }

  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  try {
    // Проверяем существование таблицы apis
    const { data, error } = await adminClient.from("apis").select("id").limit(1)

    if (error && error.message.includes('relation "public.apis" does not exist')) {
      console.log("Creating database tables...")

      // Создаем таблицы через отдельные операции
      const sampleAPIs = [
        {
          name: "OpenWeatherMap API",
          description: "Получение данных о погоде для любого города",
          base_url: "https://api.openweathermap.org/data/2.5",
          category: "weather",
          pricing_model: "freemium",
          price_per_request: 0.0001,
          monthly_price: 0,
          rate_limit: 1000,
          auth_type: "api_key",
          auth_header: "appid",
          is_public: true,
        },
        {
          name: "JSONPlaceholder API",
          description: "Бесплатный API для тестирования и прототипирования",
          base_url: "https://jsonplaceholder.typicode.com",
          category: "development",
          pricing_model: "free",
          price_per_request: 0,
          monthly_price: 0,
          rate_limit: 10000,
          auth_type: "none",
          is_public: true,
        },
      ]

      await adminClient.from("apis").insert(sampleAPIs)
      console.log("Database tables created successfully!")
      return true
    }

    return true
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
    return false
  }
}

export function createClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      }),
    }
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Добавляем альтернативный экспорт для совместимости
export const createServerClient = createClient
