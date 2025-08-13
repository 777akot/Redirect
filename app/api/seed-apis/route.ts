import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = createClient()

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

    // Добавляем API в базу данных
    const { error } = await supabase.from("apis").insert(sampleApis)

    if (error) {
      console.error("Error inserting sample APIs:", error)
      return NextResponse.json({ error: "Failed to add sample APIs" }, { status: 500 })
    }

    return NextResponse.json({ message: "Sample APIs added successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
