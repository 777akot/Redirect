-- Добавление тестовых API в каталог
INSERT INTO apis (
  id,
  name,
  description,
  category,
  base_url,
  auth_type,
  price_per_request,
  rate_limit,
  status,
  owner_id,
  created_at
) VALUES
-- Погода
(
  gen_random_uuid(),
  'OpenWeatherMap',
  'Получайте актуальные данные о погоде, прогнозы и исторические данные для любой точки мира. Поддерживает более 200,000 городов.',
  'weather',
  'https://api.openweathermap.org/data/2.5',
  'api_key',
  0.001,
  1000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'WeatherAPI',
  'Мощный API для получения данных о погоде в реальном времени, прогнозов и исторических данных с высокой точностью.',
  'weather',
  'https://api.weatherapi.com/v1',
  'api_key',
  0.002,
  1000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),

-- Финансы
(
  gen_random_uuid(),
  'Alpha Vantage',
  'Финансовые данные в реальном времени: курсы акций, валют, криптовалют и технические индикаторы для трейдинга.',
  'finance',
  'https://www.alphavantage.co/query',
  'api_key',
  0.01,
  500,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'CoinGecko API',
  'Полная информация о криптовалютах: цены, рыночная капитализация, объемы торгов и исторические данные.',
  'finance',
  'https://api.coingecko.com/api/v3',
  'none',
  0.0,
  100,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),

-- ИИ
(
  gen_random_uuid(),
  'OpenAI GPT-4',
  'Мощная языковая модель для генерации текста, ответов на вопросы, перевода и создания контента.',
  'ai',
  'https://api.openai.com/v1',
  'bearer',
  0.03,
  3000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'Stability AI',
  'Генерация изображений с помощью ИИ. Создавайте уникальные изображения по текстовому описанию.',
  'ai',
  'https://api.stability.ai/v1',
  'bearer',
  0.05,
  100,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),

-- Соцсети
(
  gen_random_uuid(),
  'Twitter API v2',
  'Доступ к данным Twitter: твиты, пользователи, тренды и аналитика для социальных медиа приложений.',
  'social',
  'https://api.twitter.com/2',
  'bearer',
  0.002,
  300,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'Instagram Basic Display',
  'Получайте фотографии и видео из Instagram аккаунтов пользователей для интеграции в ваши приложения.',
  'social',
  'https://graph.instagram.com',
  'bearer',
  0.001,
  200,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),

-- Данные
(
  gen_random_uuid(),
  'REST Countries',
  'Полная информация о всех странах мира: население, валюта, языки, флаги и географические данные.',
  'data',
  'https://restcountries.com/v3.1',
  'none',
  0.0,
  1000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'JSONPlaceholder',
  'Бесплатный API для тестирования и прототипирования. Предоставляет фейковые данные для разработки.',
  'data',
  'https://jsonplaceholder.typicode.com',
  'none',
  0.0,
  1000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),

-- Коммуникации
(
  gen_random_uuid(),
  'Twilio SMS',
  'Отправка SMS сообщений по всему миру с высокой доставляемостью и подробной аналитикой.',
  'communication',
  'https://api.twilio.com/2010-04-01',
  'basic',
  0.075,
  1000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
),
(
  gen_random_uuid(),
  'SendGrid Email',
  'Надежная доставка email сообщений с аналитикой, шаблонами и управлением подписками.',
  'communication',
  'https://api.sendgrid.com/v3',
  'bearer',
  0.001,
  1000,
  'active',
  (SELECT id FROM auth.users LIMIT 1),
  NOW()
);

-- Добавление эндпоинтов для некоторых API
INSERT INTO api_endpoints (
  id,
  api_id,
  path,
  method,
  description,
  parameters,
  created_at
) VALUES
-- OpenWeatherMap эндпоинты
(
  gen_random_uuid(),
  (SELECT id FROM apis WHERE name = 'OpenWeatherMap'),
  '/weather',
  'GET',
  'Текущая погода по координатам или названию города',
  '{"q": "string", "lat": "number", "lon": "number", "appid": "string"}',
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM apis WHERE name = 'OpenWeatherMap'),
  '/forecast',
  'GET',
  'Прогноз погоды на 5 дней с интервалом 3 часа',
  '{"q": "string", "lat": "number", "lon": "number", "appid": "string"}',
  NOW()
),

-- Alpha Vantage эндпоинты
(
  gen_random_uuid(),
  (SELECT id FROM apis WHERE name = 'Alpha Vantage'),
  '/',
  'GET',
  'Данные о акциях в реальном времени',
  '{"function": "string", "symbol": "string", "apikey": "string"}',
  NOW()
),

-- OpenAI эндпоинты
(
  gen_random_uuid(),
  (SELECT id FROM apis WHERE name = 'OpenAI GPT-4'),
  '/chat/completions',
  'POST',
  'Генерация текста с помощью GPT-4',
  '{"model": "string", "messages": "array", "max_tokens": "number"}',
  NOW()
),

-- Twilio эндпоинты
(
  gen_random_uuid(),
  (SELECT id FROM apis WHERE name = 'Twilio SMS'),
  '/Accounts/{AccountSid}/Messages.json',
  'POST',
  'Отправка SMS сообщения',
  '{"To": "string", "From": "string", "Body": "string"}',
  NOW()
);
