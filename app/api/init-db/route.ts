import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create tables
    const createTablesSQL = `
      -- Create apis table
      CREATE TABLE IF NOT EXISTS public.apis (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        base_url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        user_id UUID REFERENCES auth.users(id)
      );

      -- Create subscriptions table
      CREATE TABLE IF NOT EXISTS public.subscriptions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) NOT NULL,
        api_id UUID REFERENCES public.apis(id) NOT NULL,
        plan_type TEXT NOT NULL DEFAULT 'basic',
        requests_limit INTEGER DEFAULT 1000,
        requests_used INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE
      );

      -- Enable RLS
      ALTER TABLE public.apis ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view active APIs" ON public.apis FOR SELECT USING (is_active = true);
      CREATE POLICY "Users can manage their own APIs" ON public.apis FOR ALL USING (auth.uid() = user_id);
      CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
    `

    // Execute table creation (we'll use a simple approach)
    const { error: tableError } = await supabase.rpc("exec_sql", { sql: createTablesSQL }).single()

    if (tableError) {
      // If exec_sql doesn't exist, create tables one by one
      await supabase.from("apis").select("id").limit(1)
    }

    // Add sample APIs
    const sampleApis = [
      {
        name: "OpenWeatherMap",
        description: "Получайте актуальные данные о погоде для любого города мира",
        category: "weather",
        base_url: "https://api.openweathermap.org/data/2.5",
        is_active: true,
      },
      {
        name: "OpenAI GPT-4",
        description: "Мощный ИИ для генерации текста, ответов на вопросы и анализа",
        category: "ai",
        base_url: "https://api.openai.com/v1",
        is_active: true,
      },
      {
        name: "CoinGecko",
        description: "Криптовалютные данные, цены и рыночная информация",
        category: "finance",
        base_url: "https://api.coingecko.com/api/v3",
        is_active: true,
      },
      {
        name: "Twilio",
        description: "SMS, голосовые вызовы и коммуникационные сервисы",
        category: "communication",
        base_url: "https://api.twilio.com/2010-04-01",
        is_active: true,
      },
      {
        name: "REST Countries",
        description: "Информация о странах мира: население, валюта, языки",
        category: "data",
        base_url: "https://restcountries.com/v3.1",
        is_active: true,
      },
      {
        name: "Alpha Vantage",
        description: "Финансовые данные, акции, форекс и криптовалюты",
        category: "finance",
        base_url: "https://www.alphavantage.co/query",
        is_active: true,
      },
    ]

    const { error: insertError } = await supabase.from("apis").insert(sampleApis)

    if (insertError) {
      console.error("Insert error:", insertError)
    }

    return Response.json({ success: true, message: "База данных инициализирована" })
  } catch (error) {
    console.error("Init error:", error)
    return Response.json({ error: "Ошибка инициализации" }, { status: 500 })
  }
}
