-- Create users table (handled by Supabase Auth)
-- Create APIs table for storing API configurations
CREATE TABLE IF NOT EXISTS apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_url VARCHAR(500) NOT NULL,
  auth_type VARCHAR(50) DEFAULT 'none', -- none, bearer, api_key, basic
  auth_config JSONB DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000,
  price_per_request DECIMAL(10,4) DEFAULT 0.001,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API endpoints table for detailed endpoint configurations
CREATE TABLE IF NOT EXISTS api_endpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_id UUID REFERENCES apis(id) ON DELETE CASCADE,
  path VARCHAR(500) NOT NULL,
  method VARCHAR(10) NOT NULL,
  description TEXT,
  request_schema JSONB,
  response_schema JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  api_id UUID REFERENCES apis(id),
  plan_type VARCHAR(50) DEFAULT 'basic', -- basic, premium, enterprise
  requests_limit INTEGER DEFAULT 1000,
  requests_used INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API requests log table
CREATE TABLE IF NOT EXISTS api_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  api_id UUID REFERENCES apis(id),
  endpoint_path VARCHAR(500),
  method VARCHAR(10),
  status_code INTEGER,
  response_time INTEGER, -- in milliseconds
  request_size INTEGER,
  response_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apis_owner_id ON apis(owner_id);
CREATE INDEX IF NOT EXISTS idx_apis_category ON apis(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_api_id ON subscriptions(api_id);
CREATE INDEX IF NOT EXISTS idx_api_requests_user_id ON api_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_api_requests_created_at ON api_requests(created_at);

-- Enable Row Level Security
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- APIs: Users can read all active APIs, but only modify their own
CREATE POLICY "Users can view active APIs" ON apis
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can manage their own APIs" ON apis
  FOR ALL USING (auth.uid() = owner_id);

-- API endpoints: Users can read endpoints of active APIs
CREATE POLICY "Users can view API endpoints" ON api_endpoints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM apis 
      WHERE apis.id = api_endpoints.api_id 
      AND apis.status = 'active'
    )
  );

CREATE POLICY "API owners can manage endpoints" ON api_endpoints
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM apis 
      WHERE apis.id = api_endpoints.api_id 
      AND apis.owner_id = auth.uid()
    )
  );

-- Subscriptions: Users can only see and manage their own subscriptions
CREATE POLICY "Users can manage their own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- API requests: Users can only see their own request logs
CREATE POLICY "Users can view their own API requests" ON api_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert API requests" ON api_requests
  FOR INSERT WITH CHECK (true);
