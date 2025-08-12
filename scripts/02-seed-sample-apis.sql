-- Insert sample APIs for the catalog
INSERT INTO apis (name, description, base_url, auth_type, category, price_per_request, rate_limit, status, owner_id) VALUES
-- Weather APIs
('OpenWeather API', 'Получите актуальные данные о погоде, прогнозы и исторические данные для любой точки мира', 'https://api.openweathermap.org/data/2.5', 'api_key', 'weather', 0.001, 1000, 'active', (SELECT id FROM auth.users LIMIT 1)),
('WeatherStack', 'Простой REST API для получения текущих и исторических данных о погоде в реальном времени', 'http://api.weatherstack.com', 'api_key', 'weather', 0.002, 500, 'active', (SELECT id FROM auth.users LIMIT 1)),

-- Finance APIs  
('Alpha Vantage', 'Данные фондового рынка, форекс, криптовалют и технические индикаторы в реальном времени', 'https://www.alphavantage.co/query', 'api_key', 'finance', 0.005, 500, 'active', (SELECT id FROM auth.users LIMIT 1)),
('CoinGecko API', 'Комплексные данные о криптовалютах: цены, рыночная капитализация, объемы торгов', 'https://api.coingecko.com/api/v3', 'none', 'finance', 0.001, 1000, 'active', (SELECT id FROM auth.users LIMIT 1)),

-- AI APIs
('OpenAI GPT', 'Мощные языковые модели для генерации текста, чат-ботов и анализа контента', 'https://api.openai.com/v1', 'bearer', 'ai', 0.02, 100, 'active', (SELECT id FROM auth.users LIMIT 1)),
('Hugging Face', 'Доступ к тысячам предобученных моделей машинного обучения и NLP', 'https://api-inference.huggingface.co', 'bearer', 'ai', 0.01, 200, 'active', (SELECT id FROM auth.users LIMIT 1)),

-- Social APIs
('Twitter API v2', 'Интеграция с Twitter: публикация твитов, получение данных пользователей и аналитика', 'https://api.twitter.com/2', 'bearer', 'social', 0.003, 300, 'active', (SELECT id FROM auth.users LIMIT 1)),
('Instagram Basic Display', 'Получение фотографий, видео и базовой информации профиля Instagram', 'https://graph.instagram.com', 'bearer', 'social', 0.002, 200, 'active', (SELECT id FROM auth.users LIMIT 1)),

-- Data APIs
('REST Countries', 'Подробная информация о всех странах мира: население, валюта, языки, флаги', 'https://restcountries.com/v3.1', 'none', 'data', 0.0005, 2000, 'active', (SELECT id FROM auth.users LIMIT 1)),
('IP Geolocation', 'Определение местоположения по IP адресу с данными о стране, городе и провайдере', 'https://ipapi.co', 'api_key', 'data', 0.001, 1000, 'active', (SELECT id FROM auth.users LIMIT 1)),

-- Communication APIs
('Twilio SMS', 'Отправка SMS сообщений и голосовых вызовов по всему миру', 'https://api.twilio.com/2010-04-01', 'basic', 'communication', 0.05, 100, 'active', (SELECT id FROM auth.users LIMIT 1)),
('SendGrid Email', 'Надежная доставка email сообщений с аналитикой и шаблонами', 'https://api.sendgrid.com/v3', 'bearer', 'communication', 0.01, 500, 'active', (SELECT id FROM auth.users LIMIT 1));

-- Insert sample endpoints for some APIs
INSERT INTO api_endpoints (api_id, path, method, description) VALUES
-- OpenWeather API endpoints
((SELECT id FROM apis WHERE name = 'OpenWeather API'), '/weather', 'GET', 'Текущая погода по координатам или названию города'),
((SELECT id FROM apis WHERE name = 'OpenWeather API'), '/forecast', 'GET', 'Прогноз погоды на 5 дней с интервалом 3 часа'),
((SELECT id FROM apis WHERE name = 'OpenWeather API'), '/onecall', 'GET', 'Полный прогноз: текущая погода, почасовой и недельный прогноз'),

-- Alpha Vantage endpoints  
((SELECT id FROM apis WHERE name = 'Alpha Vantage'), '/query?function=TIME_SERIES_DAILY', 'GET', 'Ежедневные данные по акциям'),
((SELECT id FROM apis WHERE name = 'Alpha Vantage'), '/query?function=CURRENCY_EXCHANGE_RATE', 'GET', 'Курсы валют в реальном времени'),
((SELECT id FROM apis WHERE name = 'Alpha Vantage'), '/query?function=DIGITAL_CURRENCY_DAILY', 'GET', 'Ежедневные данные по криптовалютам'),

-- OpenAI GPT endpoints
((SELECT id FROM apis WHERE name = 'OpenAI GPT'), '/chat/completions', 'POST', 'Генерация ответов в формате чата'),
((SELECT id FROM apis WHERE name = 'OpenAI GPT'), '/completions', 'POST', 'Дополнение текста на основе промпта'),
((SELECT id FROM apis WHERE name = 'OpenAI GPT'), '/embeddings', 'POST', 'Создание векторных представлений текста'),

-- Twilio SMS endpoints
((SELECT id FROM apis WHERE name = 'Twilio SMS'), '/Accounts/{AccountSid}/Messages.json', 'POST', 'Отправка SMS сообщения'),
((SELECT id FROM apis WHERE name = 'Twilio SMS'), '/Accounts/{AccountSid}/Calls.json', 'POST', 'Совершение голосового вызова'),
((SELECT id FROM apis WHERE name = 'Twilio SMS'), '/Accounts/{AccountSid}/Messages.json', 'GET', 'Получение списка отправленных сообщений');
